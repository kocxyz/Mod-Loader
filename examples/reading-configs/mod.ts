/// <reference path="../../types/api.d.ts" />
import config from 'config';
import logging from 'logging';

const content = config.read('Hello World');
logging.log(content);
