import React from "react";
import DashboardNavigation from "../routes/DashboardNavigation";


const CSM = () => {
  return (
    <>
      {/* Fixed the navigation at the top */}
      <div className="fixed top-0 left-0 w-full z-10 bg-white shadow-md">
        <DashboardNavigation />
      </div>

      {/* Add padding to avoid content overlapping with the fixed nav */}
      <div className="pt-16 px-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat
        voluptatem incidunt modi fugiat cupiditate dolorem eum! Aspernatur ipsam
        ab eum quas beatae laborum quaerat inventore harum soluta amet ducimus
        quidem expedita minima natus ratione placeat doloremque dolores error
        repellendus, aliquam officia. Eos quo maxime fuga officiis culpa sint
        tempora sunt at doloremque rerum, possimus unde neque id iusto. Deserunt
        esse vitae porro quis ad vel, quod repudiandae corrupti consectetur!
        Perspiciatis libero odit molestias ab maiores quam sint iure, cumque cum
        sit in corporis veritatis eum, ex non magni. Tenetur minus hic minima
        perspiciatis ullam ducimus doloribus esse consequuntur atque voluptas.
      </div>
    </>
  );
};

export default CSM;
