import logging

from flask import current_app, request, g, jsonify, url_for, abort
from flask.views import MethodView

from webargs import fields, validate
from webargs.flaskparser import parser

from server.api import api
from server.extensions import db
from server.models import Post, User, Meta, Setting
from server.api.auth import auth
from server.api.schemas import user_schema, post_schema, posts_schema, page_schema, pages_schema, meta_schema, metas_schema, settings_schema


class LoginView(MethodView):

    args = {
        'username': fields.Str(required=True, validate=validate.Length(min=1)),
        'password': fields.Str(required=True, validate=validate.Length(min=6))
    }

    def post(self):
        args = parser.parse(self.args, request)

        user = User.query.filter_by(username=args['username']).first()
        if user is not None and user.verify_password(args['password']):
            access_token = user.generate_token()

            return {
                'access_token': access_token.decode(),
                'refresh_token': '',
                'expires_in': 3600
            }, 201

        abort(401, description='Incorrect username or password, please try again.')


class RefreshTokenView(MethodView):
    """
    rotue = '/api/auth/refresh'
    """

    def post(self):
        pass


class PostsView(MethodView):

    args = {
        'draft': fields.Boolean(missing=False),
        'limit': fields.Integer(missing=10),
        'page': fields.Integer(missing=1)
    }

    @auth.login_required
    def _login_required(self):
        pass

    def get(self, username=None, slug=None):
        args = parser.parse(self.args, request)
        status = not args['draft']

        if not status:
            self._login_required()
            if 'author' not in auth.current_user().roles():
                abort(403)

        queryset = Post.query.filter_by(type='post', status=status).order_by(Post.created.desc())
        endpoint = 'api.posts'

        if username:
            queryset = queryset.join(User).filter(User.username == username)
            endpoint = 'api.posts_by_author'

        if slug:
            queryset = queryset.join(Post.metas).filter(Meta.slug == slug)
            endpoint = 'api.posts_by_meta'

        pagination = queryset.paginate(args['page'], per_page=args['limit'], error_out=False)

        params = args.copy()
        links = {}
        if pagination.has_prev:
            params['page'] = pagination.prev_num
            url = url_for(endpoint, username=username, slug=slug, _external=True, **params)
            links['prev'] = url
        if pagination.has_next:
            params['page'] = pagination.next_num
            url = url_for(endpoint, username=username, slug=slug, _external=True, **params)
            links['next'] = url

        data = {'posts': posts_schema.dump(pagination.items), 'links': links}
        return data


class PostView(MethodView):

    args = {
        'title': fields.Str(),
        'slug': fields.Str(),
        'headline': fields.Str(),
        'content': fields.Str(),
        'metas': fields.List(fields.Str()),
        'status': fields.Boolean(missing=True)
    }

    @auth.login_required
    def _login_required(self):
        pass

    def get(self, id):
        post = Post.query.get(id)

        if not post:
            abort(404, description='Post {} doesn\'t exist'.format(id))

        if not post.status:
            self._login_required()
            if 'author' not in auth.current_user().roles():
                abort(403)

        return post_schema.dump(post)

    @auth.login_required(role='author')
    def post(self):
        args = parser.parse(self.args, request)
        post = Post(title=args['title'], slug=args['slug'], headline=args['headline'], content=args['content'], status=['status'], author_id=g.user.id)
        post.add_metas(args.metas)
        db.session.add(post)
        db.session.commit()
        return post_schema.dump(post), 201

    @auth.login_required(role='author')
    def put(self, id):
        args = parser.parse(self.args, request)
        post = Post.query.get(id)

        if not post:
            abort(404, description='Post {} doesn\'t exist'.format(id))

        for k, v in args.items():
            if k == 'metas':
                post.add_metas(v)
            else:
                setattr(post, k, v)

        db.session.commit()
        return post_schema.dump(post), 201

    @auth.login_required(role='author')
    def delete(self, id):
        post = Post.query.get(id)
        if not post:
            abort(404, description='Post {} doesn\'t exist'.format(id))

        db.session.delete(post)
        db.session.commit()
        return {}, 204


class PagesView(MethodView):

    args = {
        'limit': fields.Integer(missing=10),
        'page': fields.Integer(missing=1)
    }

    def get(self):
        args = parser.parse(self.args, request)

        queryset = Post.query.filter_by(type='page').order_by(Post.created.desc())
        endpoint = 'api.pages'

        pagination = queryset.paginate(args['page'], per_page=args['limit'], error_out=False)

        params = args.copy()
        links = {}
        if pagination.has_prev:
            params['page'] = pagination.prev_num
            url = url_for(endpoint, _external=True, **params)
            links['prev'] = url
        if pagination.has_next:
            params['page'] = pagination.next_num
            url = url_for(endpoint, _external=True, **params)
            links['next'] = url

        data = {'pages': pages_schema.dump(pagination.items), 'links': links}
        return data


class PageView(MethodView):

    args = {
        'title': fields.Str(),
        'slug': fields.Str(),
        'content': fields.Str()
    }

    def get(self, id):
        slug = request.args.get('slug')
        page = Post.query.get(id)

        if not page:
            abort(404, message='Page /{} doesn\'t exist'.format(slug))

        return page_schema.dump(page)

    @auth.login_required(role='editor')
    def post(self):
        args = parser.parse(self.args, request)
        page = Post(title=args['title'], slug=args['slug'], content=args['content'], type='page', author_id=g.user.id)
        db.session.add(page)
        db.session.commit()
        return page_schema.dump(page), 201

    @auth.login_required(role='editor')
    def put(self, id):
        args = parser.parse(self.args, request)
        page = Post.query.get(id)

        if not page:
            abort(404, message='Page /{} doesn\'t exist'.format(args['slug']))

        for k, v in args.items():
            if v:
                setattr(page, k, v)

        db.session.commit()
        return page_schema.dump(page), 201

    @auth.login_required(role='editor')
    def delete(self, id):
        slug = request.args.get('slug')
        page = Post.query.get(id)

        if not page:
            abort(404, message='Page /{} doesn\'t exist'.format(slug))

        db.session.delete(page)
        db.session.commit()
        return {}, 204


class UserView(MethodView):

    args = {
        'password': fields.Str(),
        'nickname': fields.Str(),
        'email': fields.Str()
    }

    def get(self, username):
        user = User.query.filter_by(username=username).first()
        if not user:
            abort(404, description='User {} doesn\'t exist'.format(username))

        return user_schema.dump(user)

    @auth.login_required
    def put(self, username):
        args = parser.parse(self.args, request)
        user = User.query.filter_by(username=username).first()

        if not user:
            abort(404, description='User {} doesn\'t exist'.format(username))

        if user != auth.current_user() or not auth.current_user().is_admin():
            abort(403, description='Forbidden')

        for k, v in args.items():
            if v:
                setattr(user, k, v)

        db.session.commit()
        return user_schema.dump(user), 201

    @auth.login_required(role='administrator')
    def delete(self, username):
        user = User.query.filter_by(username=username).first()
        if not user:
            abort(404, description='User {} doesn\'t exist'.format(username))

        db.session.delete(user)
        db.session.commit()
        return {}, 204


class MetasView(MethodView):

    def get(self):
        metas = Meta.query.all()
        return jsonify(metas_schema.dump(metas))


class MetaView(MethodView):

    args = {
        'name': fields.Str(),
        'slug': fields.Str(),
        'description': fields.Str()
    }

    def get(self, id):
        meta = Meta.query.get(id)
        if not meta:
            abort(404, description='Meta {} doesn\'t exist'.format(id))
        return meta_schema.dump(meta)

    @auth.login_required(role='author')
    def post(self):
        args = parser.parse(self.args, request)
        meta = Meta(name=args['name'], slug=args['slug'], description=args['description'], type='tag')
        db.session.add(meta)
        db.session.commit()
        return meta_schema.dump(meta), 201

    @auth.login_required(role='author')
    def put(self, id):
        args = parser.parse(self.args, request)
        meta = Meta.query.get(id)
        if not meta:
            abort(404, description='Meta {} doesn\'t exist'.format(id))

        for k, v in args.items():
            if v:
                setattr(meta, k, v)

        db.session.commit()
        return meta_schema.dump(meta), 201

    @auth.login_required(role='author')
    def delete(self, id):
        meta = Meta.query.get(id)
        if not meta:
            abort(404, description='Meta {} doesn\'t exist'.format(id))

        db.session.delete(meta)
        db.session.commit()
        return {}, 204


class SettingsView(MethodView):

    args = {
        'type': fields.List(fields.Str(), missing=['blog'])
    }

    @auth.login_required
    def get(self):
        args = parser.parse(self.args, request)
        settings = Setting.query.filter(Setting.type.in_(args['type'])).all()
        return jsonify(settings_schema.dump(settings))

    @auth.login_required(role='administrator')
    def put(self):
        payload = request.get_json(force=True)
        settings = Setting.query.all()

        for setting in settings:
            for k, v in payload.items():
                if setting.key == k and setting.value != v:
                    setting.value = v

        db.session.commit()
        return jsonify(settings_schema.dump(settings)), 201


api.add_url_rule('/posts', view_func=PostsView.as_view('posts'))
api.add_url_rule('/posts/author/<path:username>', view_func=PostsView.as_view('posts_by_author'))
api.add_url_rule('/posts/meta/<path:slug>', view_func=PostsView.as_view('posts_by_meta'))
post_view = PostView.as_view('post')
api.add_url_rule('/posts/<int:id>', view_func=post_view, methods=['GET', 'PUT', 'DELETE'])
api.add_url_rule('/posts', view_func=post_view, methods=['POST'])

api.add_url_rule('/pages', view_func=PagesView.as_view('pages'))
page_view = PageView.as_view('page')
api.add_url_rule('/pages/<int:id>', view_func=page_view, methods=['GET', 'PUT', 'DELETE'])
api.add_url_rule('/pages', view_func=page_view, methods=['POST'])

api.add_url_rule('/metas', view_func=MetasView.as_view('metas'))
meta_view = MetasView.as_view('meta')
api.add_url_rule('/metas/<int:id>', view_func=meta_view, methods=['GET', 'PUT', 'DELETE'])
api.add_url_rule('/metas', view_func=page_view, methods=['POST'])

api.add_url_rule('/users/<path:username>', view_func=UserView.as_view('user'), methods=['GET', 'PUT', 'DELETE'])
api.add_url_rule('/settings', view_func=SettingsView.as_view('settings'), methods=['GET', 'PUT'])

api.add_url_rule('/auth/login', view_func=LoginView.as_view('login'), methods=['POST'])
