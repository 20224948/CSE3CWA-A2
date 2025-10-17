const { initOtel } = require('../instrumentation/otel');
initOtel(); // prints spans to console when our routes run
