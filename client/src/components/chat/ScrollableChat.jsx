import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import "./chat.css"; // 🔥 Import modern styles

const ScrollableChat = ({ messages, user }) => {
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div
            key={m._id}
            className="message-wrapper"
            style={{
              marginLeft: isSameSenderMargin(messages, m, i, user._id),
              marginTop: isSameUser(messages, m, i, user._id) ? 2 : 10,
            }}
          >
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.lname} placement="bottom-start" hasArrow>
                <Avatar
                  boxSize="28px"
                  mr={2}
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                  className="chat-avatar"
                />
              </Tooltip>
            )}

            <span
              className={`message-bubble ${
                m.sender._id === user._id ? "own-message" : "other-message"
              }`}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
