import os
import sys
import hashlib
import mistune

from flask import Flask, url_for, request

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from server.config import config
from server.models import User, Post
from server.extensions import db, ma, login_manager


def register_extensions(app):
    db.init_app(app)
    ma.init_app(app)
    login_manager.init_app(app)

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    register_extensions(app)

    from server.main import main as main_blueprint
    main_blueprint.template_folder = app.config['THEMES_DIR']
    app.register_blueprint(main_blueprint)

    from server.api import api as api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')

    @app.template_filter('strftime')
    def format_datatime(value, format='%b %d, %Y'):
        return value.strftime(format)

    @app.template_filter('markdown')
    def render_markdown(content):
        return mistune.html(content)

    @app.template_filter('gravatar')
    def gravatar_url(email, size=100, default='identicon', rating='g'):
        url = 'https://www.gravatar.com/avatar'
        hash = '' if email is None else hashlib.md5(email.encode('utf-8').lower()).hexdigest()
        return '{url}/{hash}?s={size}&d={default}&r={rating}'.format(
            url=url, hash=hash, size=size, default=default, rating=rating)

    @app.context_processor
    def hash_processor():
        def hashed_url(filepath):
            import json
            path, filename = filepath.rsplit('/')
            if path == 'themes':
                active_theme = 'kiko'
                directory = os.path.join(app.static_folder, 'themes', active_theme)
                relative_path = 'themes/' + active_theme
            else:
                directory = os.path.join(app.static_folder, 'assets')
                relative_path = 'assets'

            manifest = os.path.join(directory, 'manifest.json')
            with open(manifest) as f:  
                data = json.load(f)
                hashname = data.get(filename, None)
                if hashname:
                    return os.path.join('/static', relative_path, hashname)
                return os.path.join('/static', relative_path, filename)
        return dict(hashed_url=hashed_url)

    @app.shell_context_processor
    def make_shell_context():
        return dict(app=app, db=db, User=User, Post=Post)

    app.jinja_env.globals['ANALYTICS_ID'] = config[config_name].ANALYTICS_ID

    return app


app = create_app(os.getenv('UP1AND_CONFIG') or 'default')


if __name__ == '__main__':
    app.run()
