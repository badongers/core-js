/**
 * ** Singleton. ** <br>The base object of all core based classes. Every object created within the Core framework derives from this class.
 *
 * @class XHR
 * @namespace core
 * @extends core.Core
 * @constructor
 * @param {Object} opts An object containing configurations required by the Core class.
 * @param {Object} opts.el The node element included in the class composition.
 *
 */
/**
 * LIFTED and renamed from qwest
 * TODO: Add httpMock and interceptors
 OPTIONS
 dataType : post (by default), json, text, arraybuffer, blob, document or formdata (you don't need to specify XHR2 types since they're automatically detected)
 responseType : the response type; either auto (default), json, xml, text, arraybuffer, blob or document
 cache : browser caching; default is false for GET requests and true for POST requests
 async : true (default) or false; used to make asynchronous or synchronous requests
 user : the user to access to the URL, if needed
 password : the password to access to the URL, if needed
 headers : javascript object containing headers to be sent
 withCredentials : false by default; sends credentials with your XHR2 request (more info in that post)
 timeout : the timeout for the request in ms; 3000 by default
 attempts : the total number of times to attempt the request through timeouts; 3 by default; if you want to remove the limit set it to null

 xhr.<method>(<url>[, data[, options]])
 .then(function(response){
        // Run when the request is successful
     })
 .error(function(e,url){
        // Process the error
     })
 .complete(function(){
        // Always run
     });


 xhr.limit(NUMBER) - sets simultaneous request limit
 */

(function() {
  core.registerModule({
    classname: "core.XHR",
    singleton: true,
    module: function() {
      var __xhr__ = function() {
        return win.XMLHttpRequest ?
          new XMLHttpRequest() :
          new ActiveXObject('Microsoft.XMLHTTP');
      };
      var win = window,
        doc = document,
        before,
        defaultXdrResponseType = 'json',
        limit = null,
        requests = 0,
        request_stack = [],
        xhr2 = (__xhr__().responseType === '');

      var request = function(method, url, data, options, before) {

        // Format
        method = method.toUpperCase();
        data = data || null;
        options = options || {};

        // Define variables
        var nativeResponseParsing = false,
          crossOrigin,
          xhr,
          xdr = false,
          timeoutInterval,
          aborted = false,
          attempts = 0,
          headers = {},
          mimeTypes = {
            text: '*/*',
            xml: 'text/xml',
            json: 'application/json',
            post: 'application/x-www-form-urlencoded'
          },
          accept = {
            text: '*/*',
            xml: 'application/xml; q=1.0, text/xml; q=0.8, */*; q=0.1',
            json: 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1'
          },
          contentType = 'Content-Type',
          vars = '',
          i, j,
          serialized,
          then_stack = [],
          catch_stack = [],
          complete_stack = [],
          response,
          success,
          error,
          func,

          // Define promises
          promises = {
            then: function(func) {

              if (options.async) {
                then_stack.push(func);
              } else if (success) {
                func.call(xhr, response);
              }
              return promises;
            },
            'error': function(func) {
              if (options.async) {
                catch_stack.push(func);
              } else if (error) {
                func.call(xhr, response);
              }
              return promises;
            },
            complete: function(func) {
              if (options.async) {
                complete_stack.push(func);
              } else {
                func.call(xhr);
              }
              return promises;
            }
          },
          promises_limit = {
            then: function(func) {
              request_stack[request_stack.length - 1].then.push(func);
              return promises_limit;
            },
            'error': function(func) {
              request_stack[request_stack.length - 1]['catch'].push(func);
              return promises_limit;
            },
            complete: function(func) {
              request_stack[request_stack.length - 1].complete.push(func);
              return promises_limit;
            }
          },

          // Handle the response
          handleResponse = function() {
            // Verify request's state
            // --- https://stackoverflow.com/questions/7287706/ie-9-javascript-error-c00c023f
            if (aborted) {
              return;
            }
            // Prepare
            var i, req, p, responseType;
            --requests;
            // Clear the timeout
            clearInterval(timeoutInterval);
            // Launch next stacked request
            if (request_stack.length) {
              req = request_stack.shift();
              p = qwest(req.method, req.url, req.data, req.options, req.before);
              for (i = 0; func = req.then[i]; ++i) {
                p.then(func);
              }
              for (i = 0; func = req['catch'][i]; ++i) {
                p['catch'](func);
              }
              for (i = 0; func = req.complete[i]; ++i) {
                p.complete(func);
              }
            }
            // Handle response
            try {
              // Verify status code
              // --- https://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
              if ('status' in xhr && !/^2|1223/.test(xhr.status)) {
                throw xhr.status + ' (' + xhr.statusText + ')';
              }
              // Init
              var responseText = 'responseText',
                responseXML = 'responseXML',
                parseError = 'parseError';
              // Process response
              if (nativeResponseParsing && 'response' in xhr && xhr.response !== null) {
                response = xhr.response;
              } else if (options.responseType == 'document') {
                var frame = doc.createElement('iframe');
                frame.style.display = 'none';
                doc.body.appendChild(frame);
                frame.contentDocument.open();
                frame.contentDocument.write(xhr.response);
                frame.contentDocument.close();
                response = frame.contentDocument;
                doc.body.removeChild(frame);
              } else {
                // Guess response type
                responseType = options.responseType;
                if (responseType == 'auto') {
                  if (xdr) {
                    responseType = defaultXdrResponseType;
                  } else {
                    var ct = xhr.getResponseHeader(contentType) || '';
                    if (ct.indexOf(mimeTypes.json) > -1) {
                      responseType = 'json';
                    } else if (ct.indexOf(mimeTypes.xml) > -1) {
                      responseType = 'xml';
                    } else {
                      responseType = 'text';
                    }
                  }
                }
                // Handle response type
                switch (responseType) {
                  case 'json':
                    try {
                      if ('JSON' in win) {
                        response = JSON.parse(xhr[responseText]);
                      } else {
                        response = eval('(' + xhr[responseText] + ')');
                      }
                    } catch (e) {
                      throw "Error while parsing JSON body : " + e;
                    }
                    break;
                  case 'xml':
                    // Based on jQuery's parseXML() function
                    try {
                      // Standard
                      if (win.DOMParser) {
                        response = (new DOMParser()).parseFromString(xhr[responseText], 'text/xml');
                      }
                      // IE<9
                      else {
                        response = new ActiveXObject('Microsoft.XMLDOM');
                        response.async = 'false';
                        response.loadXML(xhr[responseText]);
                      }
                    } catch (e) {
                      response = undefined;
                    }
                    if (!response || !response.documentElement || response.getElementsByTagName('parsererror').length) {
                      throw 'Invalid XML';
                    }
                    break;
                  default:
                    response = xhr[responseText];
                }
              }
              // Execute 'then' stack
              success = true;
              p = response;
              if (options.async) {
                for (i = 0; func = then_stack[i]; ++i) {

                  //console.log(method, url, xhr);
                  p = func.call(xhr, p);
                }
              }
            } catch (e) {
              error = true;
              // Execute 'catch' stack
              if (options.async) {
                for (i = 0; func = catch_stack[i]; ++i) {
                  func.call(xhr, e, url);
                }
              }
            }
            // Execute complete stack
            if (options.async) {
              for (i = 0; func = complete_stack[i]; ++i) {
                func.call(xhr);
              }
            }
          },

          // Recursively build the query string
          buildData = function(data, key) {
            var res = [],
              enc = encodeURIComponent,
              p;
            if (typeof data === 'object' && data != null) {
              for (p in data) {
                if (data.hasOwnProperty(p)) {
                  var built = buildData(data[p], key ? key + '[' + p + ']' : p);
                  if (built !== '') {
                    res = res.concat(built);
                  }
                }
              }
            } else if (data != null && key != null) {
              res.push(enc(key) + '=' + enc(data));
            }
            return res.join('&');
          };

        // New request
        ++requests;

        // Normalize options
        options.async = 'async' in options ? !!options.async : true;
        options.cache = 'cache' in options ? !!options.cache : (method != 'GET');
        options.dataType = 'dataType' in options ? options.dataType.toLowerCase() : 'post';
        options.responseType = 'responseType' in options ? options.responseType.toLowerCase() : 'auto';
        options.user = options.user || '';
        options.password = options.password || '';
        options.withCredentials = !!options.withCredentials;
        options.timeout = 'timeout' in options ? parseInt(options.timeout, 10) : 3000;
        options.attempts = 'attempts' in options ? parseInt(options.attempts, 10) : 3;

        // Guess if we're dealing with a cross-origin request
        i = url.match(/\/\/(.+?)\//);
        crossOrigin = i && i[1] ? i[1] != location.host : false;

        // Prepare data
        if ('ArrayBuffer' in win && data instanceof ArrayBuffer) {
          options.dataType = 'arraybuffer';
        } else if ('Blob' in win && data instanceof Blob) {
          options.dataType = 'blob';
        } else if ('Document' in win && data instanceof Document) {
          options.dataType = 'document';
        } else if ('FormData' in win && data instanceof FormData) {
          options.dataType = 'formdata';
        }
        switch (options.dataType) {
          case 'json':
            data = JSON.stringify(data);
            break;
          case 'post':
            data = buildData(data);
        }

        // Prepare headers
        if (options.headers) {
          var format = function(match, p1, p2) {
            return p1 + p2.toUpperCase();
          };
          for (i in options.headers) {
            headers[i.replace(/(^|-)([^-])/g, format)] = options.headers[i];
          }
        }
        if (!headers[contentType] && method != 'GET') {
          if (options.dataType in mimeTypes) {
            if (mimeTypes[options.dataType]) {
              headers[contentType] = mimeTypes[options.dataType];
            }
          }
        }
        if (!headers.Accept) {
          headers.Accept = (options.responseType in accept) ? accept[options.responseType] : '*/*';
        }
        if (!crossOrigin && !headers['X-Requested-With']) { // because that header breaks in legacy browsers with CORS
          headers['X-Requested-With'] = 'XMLHttpRequest';
        }

        // Prepare URL
        if (method == 'GET') {
          vars += data;
        }
        if (!options.cache) {
          if (vars) {
            vars += '&';
          }
          vars += '__t=' + (+new Date());
        }
        if (vars) {
          url += (/\?/.test(url) ? '&' : '?') + vars;
        }

        // The limit has been reached, stock the request
        if (limit && requests == limit) {
          request_stack.push({
            method: method,
            url: url,
            data: data,
            options: options,
            before: before,
            then: [],
            'catch': [],
            complete: []
          });
          return promises_limit;
        }

        // Send the request
        var send = function() {
          // Get XHR object
          xhr = __xhr__();
          if (crossOrigin) {
            if (!('withCredentials' in xhr) && win.XDomainRequest) {
              xhr = new XDomainRequest(); // CORS with IE8/9
              xdr = true;
              if (method != 'GET' && method != 'POST') {
                method = 'POST';
              }
            }
          }
          // Open connection
          if (xdr) {
            xhr.open(method, url);
          } else {
            xhr.open(method, url, options.async, options.user, options.password);
            if (xhr2 && options.async) {
              xhr.withCredentials = options.withCredentials;
            }
          }
          // Set headers
          if (!xdr) {
            for (var i in headers) {
              xhr.setRequestHeader(i, headers[i]);
            }
          }
          // Verify if the response type is supported by the current browser
          if (xhr2 && options.responseType != 'document') { // Don't verify for 'document' since we're using an internal routine
            try {
              xhr.responseType = options.responseType;
              nativeResponseParsing = (xhr.responseType == options.responseType);
            } catch (e) {}
          }
          // Plug response handler
          if (xhr2 || xdr) {
            xhr.onload = handleResponse;
          } else {
            xhr.onreadystatechange = function() {
              if (xhr.readyState == 4) {
                handleResponse();
              }
            };
          }
          // Override mime type to ensure the response is well parsed
          if (options.responseType !== 'auto' && 'overrideMimeType' in xhr) {
            xhr.overrideMimeType(mimeTypes[options.responseType]);
          }
          // Run 'before' callback
          if (before) {
            before.call(xhr);
          }
          // Send request
          if (xdr) {
            setTimeout(function() { // https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest
              xhr.send(method != 'GET' ? data : null);
            }, 0);
          } else {
            xhr.send(method != 'GET' ? data : null);
          }
        };

        // Timeout/attempts
        var timeout = function() {
          timeoutInterval = setTimeout(function() {
            aborted = true;
            xhr.abort();
            if (!options.attempts || ++attempts != options.attempts) {
              aborted = false;
              timeout();
              send();
            } else {
              aborted = false;
              error = true;
              response = 'Timeout (' + url + ')';
              if (options.async) {
                for (i = 0; func = catch_stack[i]; ++i) {
                  func.call(xhr, response);
                }
              }
            }
          }, options.timeout);
        };

        // Start the request
        timeout();
        send();

        // Return promises
        return promises;

      };
      var checkMocks = function(url) {
        if (core.ENV.httpMocks) {
          console.log("TODO: implement http mock");
        }
      };
      var handleMockedPromise = function() {

      };
      var create = function(method) {
        return function(url, data, options) {
          var b = before;
          before = null;

          return request(method, url, data, options, b);
        };
      };
      this.before = function(callback) {
        before = callback;
        return this;
      }
      this.get = create('GET');
      this.post = create('POST');
      this.put = create('PUT');
      this['delete'] = create('DELETE');
      this.xhr2 = xhr2;
      this.limit = function(by) {
        limit = by;
      };
      this.setDefaultXdrResponseType = function(type) {
        defaultXdrResponseType = type.toLocaleLowerCase();
      };

    }
  });
})();
