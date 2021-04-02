// import React, { useState } from "react";
// import { Card, Row, Col } from "antd";
// import { ReceivedMsg } from "./ReceivedMsg";
// import { SentMsg } from "./SentMsg";
// import Avatar from "antd/lib/avatar/avatar";

// export const Messages = (props) => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       msg: "Hello",
//     },
//     {
//       id: 2,
//       msg: "How are you",
//     },
//   ]);

//   return (
//     <Card
//       style={{
//         marginBottom: "15px",
//         border: "none",
//         maxHeight: 550,
//         minHeight: 550,
//         overflow: "scroll",
//         overflowX: "hidden",
//       }}>
//       {messages.map((item) => (
//         <div>
//           <Row
//             type="flex"
//             style={{ justifyContent: "flex-end", marginBottom: "20px" }}>
//             <p
//               style={{
//                 marginBottom: "0px",
//                 marginLeft: "10px",
//                 padding: "10px",
//                 borderRadius: "15px",
//                 borderBottomRightRadius: "0",
//                 boxShadow: "5px 3px 24px 3px rgba(208, 216, 243, 0.6)",
//               }}>
//               {item.msg}
//             </p>
//           </Row>
//           <Row
//             type="flex"
//             style={{ justifyContent: "flex-start", marginBottom: "20px" }}>
//             <Col xs={24} md={2} span={24}>
//               <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
//             </Col>
//             <Col xs={24} md={20} span={24}>
//               <p
//                 style={{
//                   marginBottom: "0px",
//                   marginLeft: "10px",
//                   backgroundColor: "#dce4f5",
//                   padding: "10px",
//                   borderRadius: "15px",
//                   borderTopLeftRadius: "0",
//                   boxShadow: "5px 3px 24px 3px rgba(208, 216, 243, 0.6)",
//                 }}>
//                 {item.msg}
//               </p>
//             </Col>
//           </Row>
//         </div>
//       ))}
//     </Card>
//   );
// };
