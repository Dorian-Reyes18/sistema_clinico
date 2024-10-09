"use client";

import { Popover } from "antd";
import { useRouter } from "next/navigation";
import Image from "next/image";

const VolverBtn = ({ currentPath }) => {
  const router = useRouter();

  const isChildRoute = () => {
    if (!currentPath) return false;
    return currentPath.split("/").filter(Boolean).length > 1;
  };

  const handleBack = () => {
    if (isChildRoute()) {
      router.back();
    }
  };

  return isChildRoute() ? (
    <Popover content="Volver" placement="bottom">
      <button
        onClick={handleBack}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <Image src="/images/chevron.png" alt="Volver" width={24} height={24} />
      </button>
    </Popover>
  ) : null;
};

export default VolverBtn;
