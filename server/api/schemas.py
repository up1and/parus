from server.extensions import ma
from server.models import User


class UserSchema(ma.Schema):
    class Meta:
        fields = ('username', 'nickname', 'email')


class MetaSchema(ma.Schema):
    class Meta:
        fields = ('id', 'slug', 'name', 'description')


class PostSchema(ma.Schema):
    class Meta:
        fields = ('id', 'slug', 'title', 'headline', 'content', 'created', 'updated'
                  'status', 'url', 'author', 'metas', 'views')

    url = ma.AbsoluteUrlFor('main.post', values=dict(id='<id>'))
    author = ma.Nested(UserSchema)
    metas = ma.Nested(MetaSchema, many=True)


class PageSchema(ma.Schema):
    class Meta:
        fields = ('id', 'slug', 'title', 'content', 'created', 'updated'
                  'url', 'author')

    url = ma.AbsoluteUrlFor('main.page', values=dict(slug='<slug>'))
    author = ma.Nested(UserSchema)


class SettingSchema(ma.Schema):
    class Meta:
        fields = ('id', 'key', 'value', 'type')


user_schema = UserSchema()

post_schema = PostSchema()
posts_schema = PostSchema(many=True)

page_schema = PostSchema()
pages_schema = PostSchema(many=True)

meta_schema = MetaSchema()
metas_schema = MetaSchema(many=True)

settings_schema = SettingSchema(many=True)
