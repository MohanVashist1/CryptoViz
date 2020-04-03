import "bootswatch/dist/lux/bootstrap.min.css";
import React from "react";
import LosersSection from './LosersSection';
import GainersSection from './GainersSection';

function Home() {
  return (
    <div>
      <GainersSection />
      <LosersSection />
    </div>
  );
}

export default Home;
