import os
import json
import datetime

from itertools import groupby

from flask import (render_template, redirect, request, g, url_for, flash, current_app, 
    abort, make_response, send_from_directory)

from server.main import main
from server.extensions import db
from server.models import Post, Meta
from server.utils import ArchiveDict


active_theme = 'kiko/'

@main.route('/')
def index():
    page = request.args.get('page', 1, type=int)
    pagination = Post.query.filter_by(type='post', status=True).order_by(Post.created.desc()).paginate(page, per_page=10, error_out=False)
    posts = pagination.items
    return render_template(active_theme + 'index.html', posts=posts, pagination=pagination)

@main.route('/post/<int:id>')
def post(id):
    post = Post.query.get_or_404(id)
    post.views += 1
    db.session.add(post)
    return render_template(active_theme + 'post.html', post=post)

@main.route('/<path:slug>')
def page(slug):
    page = Post.query.filter_by(type='page', slug=slug).first_or_404()
    return render_template(active_theme + 'page.html', page=page)

@main.route('/archive/', defaults={'year': datetime.datetime.now().year})
@main.route('/archive/<int:year>')
def archive(year):
    query = Post.query.filter_by(type='post', status=True).order_by(Post.created.desc())
    archives = ArchiveDict((year, list(posts)) for year, posts in groupby(query, lambda post: post.created.year))

    try:
        posts = archives[year]
    except KeyError:
        abort(404)
        
    pagination = {'prev': archives.prev(year), 'next': archives.next(year)}
    return render_template(active_theme + 'archive.html', posts=posts, pagination=pagination, year=year)

@main.route('/rss.xml')
def rss():
    posts = Post.query.filter_by(type='post', status=True).order_by(Post.created.desc()).limit(10)
    return render_template(active_theme + 'rss.xml', posts=posts)

@main.route('/tag/<path:slug>')
def tags(slug):
    tag = Meta.query.filter_by(type='tag', slug=slug).first_or_404()
    posts = tag.posts.order_by(Post.created.desc()).all()
    return render_template(active_theme + 'tags.html', posts=posts, tag=tag)

@main.route('/dashboard')
def dashboard():
    return render_template('dashboard/index.html')
