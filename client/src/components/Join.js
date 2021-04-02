import React from "react";
import { Typography, Button, Row, Col } from "antd";
// import { useRef, useMemo } from "react";
// import { Canvas, createPortal, useFrame } from "react-three-fiber";
// import * as THREE from "three";
import { useHistory } from "react-router-dom";
import landing from "../assets/images/landing.svg";

// import {
//   OrbitControls,
//   OrthographicCamera,
//   Text,
//   Shadow,
// } from "@react-three/drei";
const { Paragraph, Title } = Typography;

// function Sphere({ children }) {
//   const cam = useRef();
//   const [scene, target] = useMemo(() => {
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color("white");
//     const target = new THREE.WebGLMultisampleRenderTarget(2048, 2048, {
//       format: THREE.RGBFormat,
//       stencilBuffer: false,
//     });
//     target.samples = 8;
//     return [scene, target];
//   }, []);

//   useFrame((state) => {
//     state.gl.setRenderTarget(target);
//     state.gl.render(scene, cam.current);
//     state.gl.setRenderTarget(null);
//   });

//   return (
//     <>
//       <OrthographicCamera ref={cam} position={[0, 0, 10]} zoom={10} />
//       {createPortal(
//         <Text
//           color="#d9374b"
//           fontSize={4}
//           maxWidth={60}
//           lineHeight={1}
//           letterSpacing={-0.1}
//           textAlign="left"
//           text={children}
//           font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
//           anchorX="center"
//           anchorY="middle">
//           {children}
//         </Text>,
//         scene
//       )}
//       <mesh>
//         <sphereBufferGeometry attach="geometry" args={[2.1, 64, 64]} />
//         <meshStandardMaterial attach="material" map={target.texture} />
//       </mesh>
//       <Shadow
//         scale={[2, 2, 2]}
//         opacity={0.9}
//         position={[0, -2.2, 0]}
//         rotation={[-Math.PI / 2, 0, 0]}
//       />
//       <Shadow
//         color="#C12020"
//         scale={[4, 4, 1]}
//         opacity={0.8}
//         position={[0, -2.1, 0]}
//         rotation={[-Math.PI / 2, 0, 0]}
//       />
//     </>
//   );
// }

const Join = () => {
  let history = useHistory();
  return (
    <Row style={{ alignItems: "center" }}>
      <Col lg={7} span={20} className="text">
        <Title
          strong
          style={{
            fontSize: 50,
            color: "white",
          }}
        >
          DATING DESERVES BETTER
        </Title>
        <Paragraph style={{ color: "#f5f1f1" }}>
          On MATCHA, you’re more than just a photo. You have stories to tell,
          and passions to share, and things to talk about that are more
          interesting than the weather. Get noticed for who you are, not what
          you look like. Because you deserve what dating deserves: better.
        </Paragraph>
        <Row>
          <Col md={11} span={24}>
            <Button
              id="button"
              type="dashed"
              htmlType="submit"
              shape="round"
              style={{ color: "#d9374b" }}
              onClick={() => history.push("/login")}
            >
              LOGIN
            </Button>
          </Col>
          <Col md={11} span={24}>
            <Button
              id="button"
              type="ghost"
              htmlType="submit"
              shape="round"
              style={{ color: "white" }}
              onClick={() => history.push("/register")}
            >
              Register
            </Button>
          </Col>
        </Row>
      </Col>
      <Col xs={0} lg={14} span={20} className="intro">
        <div className="intro">
          <img
            style={{
              width: "100%",
              maxWidth: "800px",
              marginBottom: "60px",
              marginTop: "0",
            }}
            id="img"
            alt="login svg"
            src={landing}
          />
          {/* <Canvas
            colorManagement
            pixelRatio={window.devicePixelRatio}
            camera={{ position: [3, 3, 15], fov: 35 }}>
            <ambientLight intensity={0.5} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.2}
              penumbra={1}
              intensity={2}
            />
            <pointLight position={[-10, -10, -5]} color="red" intensity={5} />
            <pointLight position={[0, -10, 0]} intensity={1.5} />
            <Sphere>
              MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA
              MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA
              MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA
              MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA
              MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA
              MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA
              MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA
              MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA
              MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA
              MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA
              MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA
              MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA MATCHA
            </Sphere>
            <OrbitControls />
          </Canvas> */}
        </div>
      </Col>
    </Row>
  );
};

export default Join;
