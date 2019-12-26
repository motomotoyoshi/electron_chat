"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Message = require("./Message");

var _Message2 = _interopRequireDefault(_Message);

var _NewMessage = require("./NewMessage");

var _NewMessage2 = _interopRequireDefault(_NewMessage);

var _firebaseBrowser = require("firebase/firebase-browser");

var _firebaseBrowser2 = _interopRequireDefault(_firebaseBrowser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ROOM_STYLE = {
  padding: "10px 30px"
};

var Room = function (_React$Component) {
  _inherits(Room, _React$Component);

  function Room(props) {
    _classCallCheck(this, Room);

    var _this = _possibleConstructorReturn(this, (Room.__proto__ || Object.getPrototypeOf(Room)).call(this, props));

    _this.state = {
      descroption: "",
      messages: []
    };
    _this.db = _firebaseBrowser2.default.database();
    _this.handleMessagePost = _this.handleMessagePost.bind(_this);
    return _this;
  }

  _createClass(Room, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var roomId = this.props.params.roomId;

      this.fetchRoom(roomId);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var roomId = nextProps.params.roomId;

      if (roomId === this.props.params.roomId) {
        return;
      }
      if (this.stream) {
        this.stream.off();
      }
      this.setState({ messages: [] });
      this.fetchRoom(roomId);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this2 = this;

      setTimeout(function () {
        _this2.room.parentNode.scrollTop = _this2.room.parentNode.scrollHeight;
      }, 0);
    }
  }, {
    key: "handleMessagePost",
    value: function handleMessagePost(message) {
      var newItemRef = this.fbChatRoomRef.child("messages").push();
      this.user = this.user || _firebaseBrowser2.default.auth().currentUser;
      return newItemRef.update({
        writtenBy: {
          uid: this.user.uid,
          displayName: this.user.displayName,
          photoURL: this.user.photoURL
        },
        time: Date.now(),
        text: message
      });
    }
  }, {
    key: "fetchRoom",
    value: function fetchRoom(roomId) {
      var _this3 = this;

      this.fbChatRoomRef = this.db.ref("/chatrooms/" + roomId);
      this.fbChatRoomRef.once("value").then(function (snapshot) {
        var _snapshot$val = snapshot.val(),
            description = _snapshot$val.description;

        _this3.setState({ description: description });
        window.document.title = description;
      });
      this.stream = this.fbChatRoomRef.child("messages").limitToLast(10);
      this.stream.on("child_added", function (item) {
        var _ref = _this3.state || [],
            messages = _ref.messages;

        messages.push(Object.assign({ key: item.key }, item.val()));
        _this3.setState({ messages: messages });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var messages = this.state.messages;

      return _react2.default.createElement(
        "div",
        { style: ROOM_STYLE, ref: function ref(room) {
            return _this4.room = room;
          } },
        _react2.default.createElement(
          "div",
          { className: "list-group" },
          messages.map(function (m) {
            return _react2.default.createElement(_Message2.default, { key: m.key, message: m });
          })
        ),
        _react2.default.createElement(_NewMessage2.default, { onMessagePost: this.handleMessagePost })
      );
    }
  }]);

  return Room;
}(_react2.default.Component);

exports.default = Room;