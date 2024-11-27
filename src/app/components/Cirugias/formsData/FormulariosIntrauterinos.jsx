import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/authContext";
import { Modal, Spin, notification } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

// Formularios importados

// Servicios

const FormulariosIntrauterinos = ({ mode, id }) => {
  const router = useRouter();
  const { patients, token } = useAuth();

  const formConfig = [
    {
      name: "",
    },
  ];
};
export default FormulariosIntrauterinos;
