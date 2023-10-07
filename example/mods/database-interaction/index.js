/// <reference path="../../../types/sandbox-api.d.ts" />
import database from 'database';

// Read all news from the database.
// Will fail if database.news.read permission is
// not set in 'permissions.yaml'
database.news.findMany();
