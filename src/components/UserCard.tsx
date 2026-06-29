import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { use, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function UserCard({ data }: { data: object }) {
  const [id, setID] = useState(0);
  const [userData, setUserData] = useState({});
  const [top4Active, setTop4Active] = useState([]);
  const username = data.login;
  useEffect(() => {
    console.log(id);
    const search = async (id: number) => {
      //setLoader(true);
      const response = await fetch(`https://api.github.com/user/${id}`, {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2026-03-10",
        },
      });
      if (!response.ok) {
        console.log("API Request Failed");
      }
      const result = await response.json();
      console.log(result);
      //setLoader(false);
      setUserData(result);
      //return result;
    };
    const getMostActiveRepos = async (username: string) => {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?type=owner&sort=updated&direction=desc&per_page=4`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2026-03-10",
          },
        },
      );

      if (!response.ok) {
        console.log("API Request Failed");
      }
      const top4Active = await response.json();

      console.log(top4Active);
      setTop4Active(top4Active);
    };
    if (id == 0) {
      return;
    } else {
      search(id);
      getMostActiveRepos(username);
    }
  }, [id, username]);
  console.log(data);
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="p-1 hover:scale-105 focus:scale-105"
            onClick={() => setID(data.id)}
          >
            <Card className="relative mx-auto w-full max-w-3xs pt-0 border-2 border-blue-300 hover:border-blue-600 focus:border-blue-600 hover:border-4 focus:border-4">
              <div className="absolute z-30 aspect-video" />
              <img
                src={data.avatar_url}
                alt="Event cover"
                className="relative z-20 w-full object-fill"
              />
              <CardHeader>
                <CardAction></CardAction>
                <CardTitle>{data.login}</CardTitle>
                {/* <CardDescription>
            A practical talk on component APIs, accessibility, and shipping
            faster.
          </CardDescription> */}
              </CardHeader>
              <CardFooter></CardFooter>
            </Card>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <img
              src={data.avatar_url}
              alt="Event cover"
              className="z-20 size-min "
            />
            <DialogTitle className="text-center text-xl">
              {userData.name ? userData.name : userData.login}
            </DialogTitle>
            <DialogDescription>
              {userData.bio ? userData.bio : "No Bio"}
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="text-md text-blue-600">
              Followers:{" "}
              <span className="text-black">{userData.followers}</span>
            </div>
            <div className="text-md text-blue-600">
              Following:{" "}
              <span className="text-black">{userData.following}</span>
            </div>
            <div
              className="text-md text-blue-600"
              hidden={userData.blog ? false : true}
            >
              Blog:{" "}
              <a
                href={"https://" + userData.blog}
                target="_blank"
                className="cursor-pointer hover:underline hover:text-indigo-600 transition duration-200"
              >
                <span className="text-black">{userData.blog}</span>
              </a>
            </div>
            <div className="text-md text-blue-600">
              Public Repos:{" "}
              <span className="text-black">{userData.public_repos}</span>
            </div>

            <div className="text-md text-blue-600">Top Repos:</div>
            <ol>
              {top4Active.map((object, i) => (
                <li key={i}>
                  <a
                    href={object.html_url}
                    target="_blank"
                    className="cursor-pointer hover:underline hover:text-indigo-600 transition duration-200"
                  >
                    {`${i + 1}: ` + object.name}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UserCard;
