import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";

const ScrollableChat = ({ messages, user }) => {
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div
            key={m._id}
            style={{
              display: "flex",
              alignItems: "flex-end",
              marginBottom: "8px",
              paddingRight: "10px",
              paddingLeft: "5px",
            }}
          >
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.lname} placement="bottom-start" hasArrow>
                <Avatar
                  boxSize="24px" // Smaller size
                  mr={1}
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                  style={{
                    border: "1px solid #2B6CB0",
                    boxShadow: "0 0 2px rgba(0, 0, 0, 0.15)",
                  }}
                />
              </Tooltip>
            )}

            <span
              style={{
                background: `${
                  m.sender._id === user._id
                    ? "linear-gradient(145deg, #bee3f8, #90cdf4)"
                    : "linear-gradient(145deg, #b9f5d0, #9ae6b4)"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 2 : 8,
                borderRadius: "16px",
                padding: "8px 14px",
                maxWidth: "75%",
                fontSize: "0.85rem",
                fontWeight: 500,
                color: "#2D3748",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                wordWrap: "break-word",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
