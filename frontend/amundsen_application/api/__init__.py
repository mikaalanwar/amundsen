# Copyright Contributors to the Amundsen project.
# SPDX-License-Identifier: Apache-2.0

from typing import Any, Tuple
import logging

from flask import Flask, render_template, make_response
import jinja2
import os


ENVIRONMENT = os.getenv('APPLICATION_ENV', 'development')
LOGGER = logging.getLogger(__name__)


def init_routes(app: Flask) -> None:
    frontend_base = app.config.get('FRONTEND_BASE')

    app.add_url_rule('/healthcheck', 'healthcheck', healthcheck)
    app.add_url_rule('/opensearch.xml', 'opensearch.xml', opensearch, defaults={'frontend_base': frontend_base})
    app.add_url_rule('/', 'index', index, defaults={'path': '',
                                                    'frontend_base': frontend_base})  # also functions as catch_all
    app.add_url_rule('/<path:path>', 'index', index, defaults={'frontend_base': frontend_base})  # catch_all


def index(path: str, frontend_base: str) -> Any:
    try:
        return render_template("index.html", env=ENVIRONMENT, frontend_base=frontend_base)  # pragma: no cover
    except jinja2.exceptions.TemplateNotFound as e:
        LOGGER.error("index.html template not found, have you built the front-end JS (npm run build in static/?")
        raise e


def healthcheck() -> Tuple[str, int]:
    return '', 200  # pragma: no cover


def opensearch(frontend_base: str) -> Any:
    try:
        template = render_template("opensearch.xml", frontend_base=frontend_base)
        response = make_response(template)
        response.headers['Content-Type'] = 'application/xml'
        return response
    except jinja2.exceptions.TemplateNotFound as e:
        LOGGER.error("opensearch.xml template not found, have you built the front-end JS (npm run build in static/?")
        raise e
