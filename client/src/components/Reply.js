// import React from "react";
// import { Row, Col, Input, Button } from "antd";
// import { SendOutlined } from "@ant-design/icons";
// import { socketConn as socket } from "../sockets";

// export const Reply = () => {
//   const handlTyping = () => {};
//   // const sendMsg = () => {
//   //   //?get input
//   //   //?emit input + room id
//   //   socket.emit("sendMsg", {message:});
//   // };
//   return (
//     <div className="reply">
//       <Row
//         type="flex"
//         style={{
//           alignItems: "center",
//           border: "1px solid #cdcd",
//           padding: "5px",
//           borderRadius: "15px",
//           width: "100%",
//         }}>
//         <Col xs={19} md={22} span={20}>
//           <Input
//             // onChange={() => handlTyping()}
//             className="input-reply"
//             maxLength={100}
//             style={{
//               borderRadius: "13px",
//               height: "80px",
//               border: "none",
//               outline: "none",
//             }}
//             placeholder="Type a message here"
//           />
//         </Col>
//         <Col xs={4} md={2} span={2}>
//           <Button
//             type="primary"
//             shape="circle"
//             onClick={sendMsg}
//             icon={<SendOutlined style={{ fontSize: "0.8rem" }} />}
//           />
//         </Col>
//       </Row>
//     </div>
//   );
// };
