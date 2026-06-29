import { useEffect, useState } from "react";
import { Search, LoaderPinwheel } from "lucide-react";
import "./App.css";
import {
  InputGroup,
  InputGroupAddon,
  //InputGroupButton,
  InputGroupInput,
  //InputGroupText,
  //InputGroupTextarea,
} from "@/components/ui/input-group";
import UserCard from "@/components/UserCard";

function App() {
  //const [count, setCount] = useState(0)
  const [loader, setLoader] = useState(false);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(-1);
  const handleSearching = (value) => {
    setUsername(value);
    console.log(value);
  };
  const search = async (username) => {
    if (username.trim() == "") {
      setTotalUsers(-1);
      return;
    }
    setLoader(true);
    const query =
      "q=" + encodeURIComponent(`${username} in:login,name type:user`);
    const response = await fetch(
      `https://api.github.com/search/users?${query}`,
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
    const result = await response.json();
    console.log(result);
    setLoader(false);
    setUsers(result.items);
    setTotalUsers(result.items.length);
    //console.log(typeof result);
    //return result;
  };
  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        console.log(
          `I can see you're not typing. I can use "${username}" now!`,
        );
        search(username);
      },

      1000,
    );
    return () => clearTimeout(timeoutId);
  }, [username]);
  const usersData = () => {
    if (totalUsers == -1) {
      return (
        <div className="text-center text-3xl font-bold">
          Search for users to get results...
        </div>
      );
    } else if (totalUsers == 0) {
      return (
        <div className="text-center text-3xl text-red-500 font-bold animate-pulse">
          No user found!
        </div>
      );
    } else {
      return (
        <div className="grid lg:grid-cols-5 sm:grid-cols-1 md:grid-cols-3 gap-2 justify-items-center mx-2">
          {users.map((user, i) => (
            <UserCard data={user} key={i}></UserCard>
          ))}
        </div>
      );
    }
  };
  return (
    <div>
      <section id="header">
        <div className="text-3xl text-blue-600 font-bold text-center p-1 animate-in">
          Github Profile Searcher
        </div>
      </section>
      <section id="search">
        <div className="min-w-max hover:scale-105 focus:scale-105">
          <InputGroup className="flex mx-auto border-2 max-w-400 w-200 h-12 mt-8 border-blue-600">
            <InputGroupInput
              placeholder="Search..."
              onChange={(e) => {
                handleSearching(e.target.value);
              }}
              value={username}
            />
            <InputGroupAddon>
              <Search className="size-6" />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end" hidden={!loader}>
              <LoaderPinwheel className="size-6 animate-spin" />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </section>
      <br></br>
      <section id="users">{usersData()}</section>
    </div>
  );
}

export default App;
