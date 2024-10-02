"use client";
import { useAuth } from "@/app/hooks/authContext";
import { useState, useEffect } from "react";

const TotalCardSurgeries = () => {
  const { user, loading, surgeriesPost, recentSurgeries, error } = useAuth();
  const [surgeryCounts, setSurgeryCounts] = useState({
    percutanea: 0,
    abierta: 0,
    endoscopica: 0,
    neonatal: 0,
    nerviosoCentral: 0,
  });

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <h3>Datos durgeries</h3>
      {surgeriesPost.registros.length > 0 ? (
        <pre>{JSON.stringify(recentSurgeries, null, 2)}</pre>
      ) : (
        <>
          {console.log(surgeriesPost.registros)}
          <p>error</p>
        </>
      )}
    </div>
  );
};

export default TotalCardSurgeries;
