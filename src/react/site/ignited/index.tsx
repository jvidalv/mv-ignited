import React, { useEffect, useMemo, useState } from "react";
import { getSearchUsers, SearchedUser } from "../../../injected/utils/data";
import { useQuery } from "@tanstack/react-query";
import { storeSet, useStore, useUpdateUserInStore } from "../../../utils/store";
import { Button, Input, Label, Tooltip } from "../components/ui";
import useClipboard from "../../hooks/use-clipboard";
import toast from "react-hot-toast";
import clsx from "clsx";

const User = ({ user }: { user: SearchedUser }) => {
  const { users } = useStore((s) => ({
    users: s.users,
    update: s.update,
  }));

  const userInStore = users.find((u) => u.username === user.value);
  const { onUpdateUserInStore } = useUpdateUserInStore({
    username: user.value,
    uid: user.data.uid,
    avatar: user.data.avatar,
  });

  const avatarSrc = useMemo(() => {
    if (userInStore?.avatarCustom) {
      return userInStore?.avatarCustom;
    }

    if (user.data.avatar.startsWith("https")) {
      return user.data.avatar;
    }

    return `https://mediavida.b-cdn.net/img/users/avatar/${user.data.avatar}`;
  }, [userInStore]);

  return (
    <div
      className={clsx(
        "bg-surface rounded shadow p-4",
        userInStore?.isIgnored && "opacity-50 hover:opacity-100 transition",
      )}
    >
      <div className="flex items-center gap-4">
        <img
          alt="avatar"
          width={32}
          height={32}
          className="w-12 h-12"
          src={avatarSrc}
        />
        <a
          style={{ color: userInStore?.usernameColour }}
          className={clsx(
            "text-lg font-medium text-white hover:underline",
            userInStore?.usernameCustom && "line-through opacity-50",
          )}
          href={`https://www.mediavida.com/id/${user.data.nombre}`}
        >
          {user.data.nombre}
        </a>
        <a
          style={{ color: userInStore?.usernameColour }}
          className="text-lg font-medium text-white hover:underline"
          href={`https://www.mediavida.com/id/${user.data.nombre}`}
        >
          {userInStore?.usernameCustom}
        </a>
      </div>
      <div className="mt-4">
        <div className="grid gap-2.5">
          <div className="grid grid-cols-4 gap-2">
            <div className="grid gap-1 col-span-3">
              <Label>Username custom</Label>
              <Input
                value={userInStore?.usernameCustom ?? ""}
                onChange={(e) =>
                  onUpdateUserInStore("usernameCustom", e.target.value)
                }
                placeholder="Este nombre remplazara al original en todo el foro!"
              />
            </div>
            <div className="grid gap-1">
              <Label>Color</Label>
              <div className="flex gap-1">
                <Input
                  type="color"
                  className="p-0 w-16 h-10"
                  value={userInStore?.usernameColour ?? ""}
                  onChange={(e) =>
                    onUpdateUserInStore("usernameColour", e.target.value)
                  }
                />
                <Tooltip content="Eliminar color">
                  <button
                    onClick={() =>
                      onUpdateUserInStore("usernameColour", undefined)
                    }
                  >
                    🗑️
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <Label>Avatar custom</Label>
            <Input
              value={userInStore?.avatarCustom ?? ""}
              onChange={(e) =>
                onUpdateUserInStore("avatarCustom", e.target.value)
              }
              placeholder="Para que funcione tiene que ser una url, recomiendo imgur!"
            />
          </div>
          <div className="grid gap-1">
            <Label>Color del borde en mensajes</Label>
            <div className="flex gap-1">
              <Input
                type="color"
                className="p-0 w-16 h-10"
                value={userInStore?.postBorderColour ?? ""}
                onChange={(e) =>
                  onUpdateUserInStore("postBorderColour", e.target.value)
                }
              />
              <Tooltip content="Eliminar color">
                <button
                  onClick={() =>
                    onUpdateUserInStore("postBorderColour", undefined)
                  }
                >
                  🗑️
                </button>
              </Tooltip>
            </div>
          </div>
          <div className="flex items-center justify-start gap-2">
            <Label>Ignorado</Label>
            <input
              type="checkbox"
              checked={!!userInStore?.isIgnored}
              onChange={() =>
                onUpdateUserInStore("isIgnored", !userInStore?.isIgnored)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("q");

function Ignited() {
  const [username, setUsername] = useState(query ?? "");
  const state = useStore((s) => s);
  const [modifiedStore, setModifiedStore] = useState(
    JSON.stringify(state, null, 2),
  );

  useEffect(() => {
    setModifiedStore(JSON.stringify(state, null, 2));
  }, [state]);

  const { data, isFetched } = useQuery({
    queryKey: ["users", username],
    queryFn: () => getSearchUsers(username),
    enabled: username?.length > 2,
  });

  const saveStore = () => {
    try {
      const modifiedStoreAsObject = JSON.parse(modifiedStore);
      storeSet(modifiedStoreAsObject);
      useStore.setState(modifiedStoreAsObject);
      toast.success("Configuración guardada y cargada!");
    } catch (e) {
      toast.error("La configuración tiene algún error!");
    }
  };

  const { copyToClipboard } = useClipboard();

  return (
    <div className="min-h-screen bg-surface-high">
      <header className="bg-surface shadow h-16">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <h1 className="font-black text-white">MV-Ignited 🔥</h1>
          <button
            onClick={() =>
              history.length > 1
                ? history.back()
                : (() => (window.location.href = "https://www.mediavida.com"))()
            }
            className="text-primary hover:underline text-sm"
          >
            Volver a Mediavida ⬅️
          </button>
        </div>
      </header>
      <main className="container p-4 mx-auto">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <h2 className="font-medium text-white">Busqueda de usuarios</h2>
            <Input
              onChange={(e) => setUsername(e.target.value)}
              defaultValue={query ?? ""}
              className="mt-4"
              placeholder="Escribe el nombre 🔍"
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
              {!data &&
                !isFetched &&
                state.users?.map((user) => (
                  <User
                    key={user.username}
                    user={{
                      value: user.username,
                      data: {
                        uid: "",
                        avatar: user.avatar,
                        nombre: user.username,
                      },
                    }}
                  />
                ))}
              {isFetched && !data?.length && (
                <div className="text-gray-400">
                  No hay ningún usuario que coincida con ese nombre!
                </div>
              )}
              {data?.map((user) => <User key={user.value} user={user} />)}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-white">Configuración</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => copyToClipboard(modifiedStore)}
                  className="text-gray-400 hover:text-white"
                >
                  Copiar
                </button>
              </div>
            </div>
            <textarea
              rows={50}
              value={modifiedStore}
              onChange={(e) => setModifiedStore(e.target.value)}
              className="mt-4 p-4 rounded bg-black text-green-500 w-full text-xs"
            />
            <Button className="mt-2 w-full" onClick={saveStore}>
              Guardar
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Ignited;
