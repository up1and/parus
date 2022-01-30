from flask import jsonify

from server.api import api


@api.app_errorhandler(401)
def http_unauthorized(e):
    response = jsonify({'title': 'Unauthorized', 'message': e.description})
    return response, 401

@api.app_errorhandler(403)
def http_forbidden(e):
    response = jsonify({'title': 'Forbidden', 'message': e.description})
    return response, 403

@api.app_errorhandler(404)
def http_not_found(e):
    response = jsonify({'title': 'Not Found', 'message': e.description})
    return response, 404

@api.app_errorhandler(422)
def http_unprocessable_entity(e):
    response = jsonify({'title': 'Unprocessable Entity', 'message': e.description})
    return response, 422
