/// <reference path="../../../types/sandbox-api.d.ts" />
import config from 'config';

// Create a default configuration if it doesn't exist
const wasCreated = config.createDefault('news', {
  title: 'Example Title',
  message: 'Example Message',
});

wasCreated; // represents if the default was created or previously the configuration existed.

// Now is garanteed to exist since we create a default
// above when it doesn't exist.
const newsConfiguration = config.read('news');

newsConfiguration.title; // Example Title
newsConfiguration.message; // Example Message
