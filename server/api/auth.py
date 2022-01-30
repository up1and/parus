from flask import g

from flask_httpauth import HTTPTokenAuth

from server.models import User, AnonymousUser


auth = HTTPTokenAuth(scheme='Bearer')


@auth.get_user_roles
def get_user_roles(username):
    user = User.query.filter_by(username=username).first()
    return user.roles()

@auth.verify_token
def verify_token(token):
    try:
        user = User.verify_token(token)
    except:
        return False
    if user:
        g.flask_httpauth_user = user
        return True
    else:
        g.flask_httpauth_user = AnonymousUser()
    return False
