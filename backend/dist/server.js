"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _mongodb = require("mongodb");
require("regenerator-runtime/runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; } // server.js
var app = (0, _express["default"])();
var PORT = process.env.PORT || 3000;

// Middleware
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use(_express["default"]["static"]("frontend/public"));
var username = "u22598805";
var password = "someProjectpassword";

// MongoDB Connection URI
var uri = "mongodb+srv://".concat(username, ":").concat(password, "@imy220.f7q7o.mongodb.net/?retryWrites=true&w=majority&appName=IMY220");

// Create a new MongoClient
var client = new _mongodb.MongoClient(uri);
var dbName = "IMY200_Project";
function connectToMongoDB() {
  return _connectToMongoDB.apply(this, arguments);
} // --------------------------------------------------- CRUD ---------------------------------------------------
// CREATE
function _connectToMongoDB() {
  _connectToMongoDB = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17() {
    return _regeneratorRuntime().wrap(function _callee17$(_context17) {
      while (1) switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          _context17.next = 3;
          return client.connect();
        case 3:
          console.log("Connected to MongoDB");
          _context17.next = 9;
          break;
        case 6:
          _context17.prev = 6;
          _context17.t0 = _context17["catch"](0);
          console.log("Error connecting to MongoDB", _context17.t0);
        case 9:
        case "end":
          return _context17.stop();
      }
    }, _callee17, null, [[0, 6]]);
  }));
  return _connectToMongoDB.apply(this, arguments);
}
function runInsertQuery(_x, _x2) {
  return _runInsertQuery.apply(this, arguments);
} // READ
function _runInsertQuery() {
  _runInsertQuery = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee18(collectionName, document) {
    var database, collection, result;
    return _regeneratorRuntime().wrap(function _callee18$(_context18) {
      while (1) switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          database = client.db(dbName);
          collection = database.collection(collectionName);
          _context18.next = 5;
          return collection.insertOne(document);
        case 5:
          result = _context18.sent;
          return _context18.abrupt("return", result);
        case 9:
          _context18.prev = 9;
          _context18.t0 = _context18["catch"](0);
          console.error("Error fetching from ".concat(collectionName, ":"), _context18.t0);
          throw _context18.t0;
        case 13:
        case "end":
          return _context18.stop();
      }
    }, _callee18, null, [[0, 9]]);
  }));
  return _runInsertQuery.apply(this, arguments);
}
function runFindQuery(_x3, _x4, _x5) {
  return _runFindQuery.apply(this, arguments);
} // UPDATE
function _runFindQuery() {
  _runFindQuery = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee19(collectionName, query, options) {
    var database, collection, cursor;
    return _regeneratorRuntime().wrap(function _callee19$(_context19) {
      while (1) switch (_context19.prev = _context19.next) {
        case 0:
          _context19.prev = 0;
          database = client.db(dbName);
          collection = database.collection(collectionName);
          cursor = collection.find(query, options);
          _context19.next = 6;
          return cursor.toArray();
        case 6:
          return _context19.abrupt("return", _context19.sent);
        case 9:
          _context19.prev = 9;
          _context19.t0 = _context19["catch"](0);
          console.error("Error fetching from ".concat(collectionName, ":"), _context19.t0);
          throw _context19.t0;
        case 13:
        case "end":
          return _context19.stop();
      }
    }, _callee19, null, [[0, 9]]);
  }));
  return _runFindQuery.apply(this, arguments);
}
function runUpdateQuery(_x6, _x7, _x8) {
  return _runUpdateQuery.apply(this, arguments);
} // DELETE
function _runUpdateQuery() {
  _runUpdateQuery = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee20(collectionName, filter, updateDoc) {
    var database, collection, result;
    return _regeneratorRuntime().wrap(function _callee20$(_context20) {
      while (1) switch (_context20.prev = _context20.next) {
        case 0:
          _context20.prev = 0;
          database = client.db(dbName);
          collection = database.collection(collectionName);
          _context20.next = 5;
          return collection.updateOne(filter, updateDoc);
        case 5:
          result = _context20.sent;
          return _context20.abrupt("return", result);
        case 9:
          _context20.prev = 9;
          _context20.t0 = _context20["catch"](0);
          console.error("Error fetching from ".concat(collectionName, ":"), _context20.t0);
          throw _context20.t0;
        case 13:
        case "end":
          return _context20.stop();
      }
    }, _callee20, null, [[0, 9]]);
  }));
  return _runUpdateQuery.apply(this, arguments);
}
function runDeleteQuery(_x9, _x10) {
  return _runDeleteQuery.apply(this, arguments);
} //Adding custom user id
// ---------------------------------------------- API Routes ---------------------------------------------
// ---------------------------- USERS ------------------------------
// GET: Retrieve all users
function _runDeleteQuery() {
  _runDeleteQuery = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee21(collectionName, filter) {
    var database, collection, result;
    return _regeneratorRuntime().wrap(function _callee21$(_context21) {
      while (1) switch (_context21.prev = _context21.next) {
        case 0:
          _context21.prev = 0;
          database = client.db(dbName);
          collection = database.collection(collectionName);
          _context21.next = 5;
          return collection.deleteOne(filter);
        case 5:
          result = _context21.sent;
          return _context21.abrupt("return", result);
        case 9:
          _context21.prev = 9;
          _context21.t0 = _context21["catch"](0);
          console.error("Error fetching from ".concat(collectionName, ":"), _context21.t0);
          throw _context21.t0;
        case 13:
        case "end":
          return _context21.stop();
      }
    }, _callee21, null, [[0, 9]]);
  }));
  return _runDeleteQuery.apply(this, arguments);
}
app.get("/api/users", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var results, userCount;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return runFindQuery("users", {}, {});
        case 3:
          results = _context.sent;
          // Count the number of users
          userCount = results.length; // Respond with the count and the list of users
          res.json({
            count: userCount,
            users: results
          });
          _context.next = 12;
          break;
        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error("Error retrieving users:", _context.t0);
          res.status(500).json({
            message: _context.t0.message
          });
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 8]]);
  }));
  return function (_x11, _x12) {
    return _ref.apply(this, arguments);
  };
}());

// POST: Create a new user
app.post("/api/users", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var newUser, result;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          newUser = req.body;
          _context2.next = 4;
          return getNextSequenceValue("userId");
        case 4:
          newUser.userId = _context2.sent;
          _context2.next = 7;
          return runInsertQuery("users", newUser);
        case 7:
          result = _context2.sent;
          res.status(201).json({
            message: "User added!",
            result: result
          });
          _context2.next = 15;
          break;
        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          console.error("Error posting users:", _context2.t0);
          res.status(400).json({
            message: _context2.t0.message
          });
        case 15:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 11]]);
  }));
  return function (_x13, _x14) {
    return _ref2.apply(this, arguments);
  };
}());

// GET: Retrieve a user by id
app.get("/api/users/:id", /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var id, results;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = req.params.id;
          _context3.next = 4;
          return runFindQuery("users", {
            userId: parseInt(id)
          }, {});
        case 4:
          results = _context3.sent;
          if (results.length === 0) {
            res.status(404).json({
              message: "User not found"
            });
          } else {
            res.json(results[0]);
          }
          _context3.next = 12;
          break;
        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          console.error("Error retrieving user:", _context3.t0);
          res.status(500).json({
            message: _context3.t0.message
          });
        case 12:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 8]]);
  }));
  return function (_x15, _x16) {
    return _ref3.apply(this, arguments);
  };
}());

// PATCH: Update a user by id
app.patch("/api/users/:id", /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var id, updateData, result;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          updateData = {
            $set: req.body
          };
          _context4.next = 5;
          return runUpdateQuery("users", {
            userId: parseInt(id)
          }, updateData);
        case 5:
          result = _context4.sent;
          if (result.matchedCount === 0) {
            res.status(404).json({
              message: "User not found"
            });
          } else {
            res.json({
              message: "User updated!",
              result: result
            });
          }
          _context4.next = 13;
          break;
        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.error("Error patching user:", _context4.t0);
          res.status(400).json({
            message: _context4.t0.message
          });
        case 13:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 9]]);
  }));
  return function (_x17, _x18) {
    return _ref4.apply(this, arguments);
  };
}());

// DELETE: Delete a user by id
app["delete"]("/api/users/:id", /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var id, result;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          id = req.params.id;
          _context5.next = 4;
          return runDeleteQuery("users", {
            userId: parseInt(id)
          });
        case 4:
          result = _context5.sent;
          if (result.deletedCount === 0) {
            res.status(404).json({
              message: "User not found"
            });
          } else {
            res.json({
              message: "User deleted!",
              result: result
            });
          }
          _context5.next = 12;
          break;
        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.error("Error deleting users:", _context5.t0);
          res.status(500).json({
            message: _context5.t0.message
          });
        case 12:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 8]]);
  }));
  return function (_x19, _x20) {
    return _ref5.apply(this, arguments);
  };
}());

// ---------------------------- SONGS ------------------------------

// GET: Retrieve all songs
app.get("/api/songs", /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var results;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return runFindQuery("songs", {}, {});
        case 3:
          results = _context6.sent;
          res.json(results);
          _context6.next = 10;
          break;
        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            message: _context6.t0.message
          });
        case 10:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 7]]);
  }));
  return function (_x21, _x22) {
    return _ref6.apply(this, arguments);
  };
}());

// POST: Add a new song
app.post("/api/songs", /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var newSong, result;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          newSong = req.body;
          _context7.next = 4;
          return runInsertQuery("songs", newSong);
        case 4:
          result = _context7.sent;
          res.status(201).json({
            message: "Song added!",
            result: result
          });
          _context7.next = 12;
          break;
        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](0);
          console.error("Error posting song:", _context7.t0);
          res.status(400).json({
            message: _context7.t0.message
          });
        case 12:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 8]]);
  }));
  return function (_x23, _x24) {
    return _ref7.apply(this, arguments);
  };
}());

// GET: Retrieve a song by id
app.get("/api/songs/:id", /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var id, result;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          id = req.params.id;
          _context8.next = 4;
          return runFindQuery("songs", {
            id: parseInt(id)
          }, {});
        case 4:
          result = _context8.sent;
          if (result.length === 0) {
            res.status(404).json({
              message: "Song not found"
            });
          } else {
            res.json(result[0]);
          }
          _context8.next = 12;
          break;
        case 8:
          _context8.prev = 8;
          _context8.t0 = _context8["catch"](0);
          console.error("Error retrieving song:", _context8.t0);
          res.status(500).json({
            message: _context8.t0.message
          });
        case 12:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 8]]);
  }));
  return function (_x25, _x26) {
    return _ref8.apply(this, arguments);
  };
}());

// PATCH: Update a song by id
app.patch("/api/songs/:id", /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var id, updateData, result;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          id = req.params.id;
          updateData = {
            $set: req.body
          };
          _context9.next = 5;
          return runUpdateQuery("songs", {
            id: parseInt(id)
          }, updateData);
        case 5:
          result = _context9.sent;
          if (result.matchedCount === 0) {
            res.status(404).json({
              message: "Song not found"
            });
          } else {
            res.json({
              message: "Song updated!",
              result: result
            });
          }
          _context9.next = 13;
          break;
        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](0);
          console.error("Error patching song:", _context9.t0);
          res.status(400).json({
            message: _context9.t0.message
          });
        case 13:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 9]]);
  }));
  return function (_x27, _x28) {
    return _ref9.apply(this, arguments);
  };
}());

// DELETE: Delete song by id
app["delete"]("/api/songs/:id", /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res) {
    var id, result;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          id = req.params.id;
          _context10.next = 4;
          return runDeleteQuery("songs", {
            id: parseInt(id)
          });
        case 4:
          result = _context10.sent;
          if (result.deletedCount === 0) {
            res.status(404).json({
              message: "Song not found"
            });
          } else {
            res.json({
              message: "Song deleted!",
              result: result
            });
          }
          _context10.next = 12;
          break;
        case 8:
          _context10.prev = 8;
          _context10.t0 = _context10["catch"](0);
          console.error("Error deleting song:", _context10.t0);
          res.status(500).json({
            message: _context10.t0.message
          });
        case 12:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 8]]);
  }));
  return function (_x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}());

// ---------------------------- PLAYLISTS ------------------------------

// GET: Retrieve all playlists
app.get("/api/playlists", /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res) {
    var results;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return runFindQuery("playlists", {}, {});
        case 3:
          results = _context11.sent;
          res.json(results);
          _context11.next = 11;
          break;
        case 7:
          _context11.prev = 7;
          _context11.t0 = _context11["catch"](0);
          console.error("Error retrieving playlists:", _context11.t0);
          res.status(500).json({
            message: _context11.t0.message
          });
        case 11:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 7]]);
  }));
  return function (_x31, _x32) {
    return _ref11.apply(this, arguments);
  };
}());

// POST: Add a new playlist
app.post("/api/playlists", /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(req, res) {
    var newPlaylist, result;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          newPlaylist = req.body;
          _context12.next = 4;
          return runInsertQuery("playlists", newPlaylist);
        case 4:
          result = _context12.sent;
          res.status(201).json({
            message: "Playlist added!",
            result: result
          });
          _context12.next = 12;
          break;
        case 8:
          _context12.prev = 8;
          _context12.t0 = _context12["catch"](0);
          console.error("Error posting playlists:", _context12.t0);
          res.status(400).json({
            message: _context12.t0.message
          });
        case 12:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[0, 8]]);
  }));
  return function (_x33, _x34) {
    return _ref12.apply(this, arguments);
  };
}());

// GET: Retrieve a playlist by id
app.get("/api/playlists/:id", /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(req, res) {
    var id, result;
    return _regeneratorRuntime().wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          id = req.params.id;
          _context13.next = 4;
          return runFindQuery("playlists", {
            id: parseInt(id)
          }, {});
        case 4:
          result = _context13.sent;
          if (result.length === 0) {
            res.status(404).json({
              message: "Playlist not found"
            });
          } else {
            res.json(result[0]);
          }
          _context13.next = 12;
          break;
        case 8:
          _context13.prev = 8;
          _context13.t0 = _context13["catch"](0);
          console.error("Error retrieving playlist:", _context13.t0);
          res.status(500).json({
            message: _context13.t0.message
          });
        case 12:
        case "end":
          return _context13.stop();
      }
    }, _callee13, null, [[0, 8]]);
  }));
  return function (_x35, _x36) {
    return _ref13.apply(this, arguments);
  };
}());
app.patch("/api/playlists/:id", /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(req, res) {
    var id, updateData, result;
    return _regeneratorRuntime().wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          id = req.params.id;
          updateData = {
            $set: req.body
          };
          _context14.next = 5;
          return runUpdateQuery("playlists", {
            id: parseInt(id)
          }, updateData);
        case 5:
          result = _context14.sent;
          if (result.matchedCount === 0) {
            res.status(404).json({
              message: "Playlist not found"
            });
          } else {
            res.json({
              message: "Playlist updated!",
              result: result
            });
          }
          _context14.next = 13;
          break;
        case 9:
          _context14.prev = 9;
          _context14.t0 = _context14["catch"](0);
          console.error("Error patching playlist:", _context14.t0);
          res.status(400).json({
            message: _context14.t0.message
          });
        case 13:
        case "end":
          return _context14.stop();
      }
    }, _callee14, null, [[0, 9]]);
  }));
  return function (_x37, _x38) {
    return _ref14.apply(this, arguments);
  };
}());

// DELETE: Delete playlist by id
app["delete"]("/api/playlists/:id", /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15(req, res) {
    var id, result;
    return _regeneratorRuntime().wrap(function _callee15$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          id = req.params.id;
          _context15.next = 4;
          return runDeleteQuery("playlists", {
            id: parseInt(id)
          });
        case 4:
          result = _context15.sent;
          if (result.deletedCount === 0) {
            res.status(404).json({
              message: "Playlist not found"
            });
          } else {
            res.json({
              message: "Playlist deleted!",
              result: result
            });
          }
          _context15.next = 12;
          break;
        case 8:
          _context15.prev = 8;
          _context15.t0 = _context15["catch"](0);
          console.error("Error deleting playlist:", _context15.t0);
          res.status(500).json({
            message: _context15.t0.message
          });
        case 12:
        case "end":
          return _context15.stop();
      }
    }, _callee15, null, [[0, 8]]);
  }));
  return function (_x39, _x40) {
    return _ref15.apply(this, arguments);
  };
}());

// Start the server
app.listen(PORT, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16() {
  return _regeneratorRuntime().wrap(function _callee16$(_context16) {
    while (1) switch (_context16.prev = _context16.next) {
      case 0:
        _context16.next = 2;
        return connectToMongoDB();
      case 2:
        console.log("Server is running on port: ".concat(PORT, " link: http://localhost:").concat(PORT, "/"));
      case 3:
      case "end":
        return _context16.stop();
    }
  }, _callee16);
})));