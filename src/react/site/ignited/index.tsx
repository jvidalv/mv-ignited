import React, { useState } from "react";
import { getUsers } from "../../../injected/utils/data";
import { useQuery } from "@tanstack/react-query";

function Ignited() {
  const [username, setUsername] = useState("");
  const { data, isFetched } = useQuery({
    queryKey: ["users", username],
    queryFn: () => getUsers(username),
    enabled: username?.length > 2,
  });

  return (
    <div className="min-h-screen bg-surface-high">
      <header className="bg-surface shadow h-16 p-4">
        <div className="container flex items-center justify-between">
          <h1 className="font-black text-white">MV-Ignited 🔥</h1>
          <button
            onClick={() => history.back()}
            className="text-primary hover:underline text-sm"
          >
            Volver a Mediavida
          </button>
        </div>
      </header>
      <main className="container p-4">
        <div>
          <label className="text-white">Busqueda de usuarios</label>
        </div>
        <input
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 rounded px-2 py-1"
          placeholder="Escribe el nombre"
        />
        <div className="grid grid-cols-6 gap-4 mt-4">
          {isFetched && !data?.length && (
            <div className="text-gray-400">
              No hay ningun usuario que coincida con ese nombre.
            </div>
          )}
          {data?.map((user) => (
            <div key={user.data.uid} className="bg-surface rounded shadow p-4">
              <img
                src={` https://mediavida.b-cdn.net/img/users/avatar/${user.data.avatar}`}
              />
              <a
                className="mt-1 text-white hover:underline"
                href={`https://www.mediavida.com/id/${user.data.nombre}`}
              >
                {user.data.nombre}
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Ignited;
