import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Signup = () => {
  useEffect(() => {
    document.title = `Signup`;
  }, [])

  const [credentials, setCredentials] = useState({
    username: "",
    name: "",
    lname: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading("create acount...");
    await signup(credentials);
  };

  return (
    <div>
      <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
        <div className="flex">
          {/* Name */}
          <div className="mr-5">
            <label
              htmlFor="name"
              className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
            >
              Your username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={onChange}
              name="username"
              id="username"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-zinc-800 focus:border-zinc-800 block w-full p-2.5 dark:bg-zinc-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-zinc-800 dark:focus:border-zinc-500"
              placeholder="Enter your username"
              minLength={3}
              required
            />
          </div>

          {/* Name */}
          <div className="mr-5">
            <label
              htmlFor="name"
              className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
            >
              Your First Name
            </label>
            <input
              type="text"
              value={credentials.name}
              onChange={onChange}
              name="name"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-zinc-800 focus:border-zinc-800 block w-full p-2.5 dark:bg-zinc-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-zinc-800 dark:focus:border-zinc-500"
              placeholder="Enter your first name"
              minLength={3}
              required
            />
          </div>

          {/*fName */}
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
            >
              Your Last Name
            </label>
            <input
              type="text"
              value={credentials.lname}
              onChange={onChange}
              name="lname"
              id="lname"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-zinc-800 focus:border-zinc-800 block w-full p-2.5 dark:bg-zinc-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-zinc-800 dark:focus:border-zinc-500"
              placeholder="Enter your last name"
              minLength={3}
              required
            />
          </div>
        </div>
        {/* // Email */}
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-zinc-800 focus:border-zinc-800 block w-full p-2.5 dark:bg-zinc-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-zinc-800 dark:focus:border-zinc-500"
            placeholder="name@company.com"
            value={credentials.email}
            onChange={onChange}
            minLength={5}
            required
          />
        </div>

        <div className="flex">
          <div className="mr-5">
            <label
              htmlFor="password"
              className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              value={credentials.password}
              onChange={onChange}
              minLength={8}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-zinc-800 focus:border-zinc-800 block w-full p-2.5 dark:bg-zinc-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-zinc-800 dark:focus:border-zinc-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="cpassword"
              className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
            >
              Confirm password
            </label>
            <input
              type="password"
              name="cpassword"
              id="cpassword"
              value={credentials.cpassword}
              onChange={onChange}
              minLength={8}
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-zinc-800 focus:border-zinc-800 block w-full p-2.5 dark:bg-zinc-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-zinc-800 dark:focus:border-zinc-500"
              required
            />
          </div>
        </div>

        

        <button
          type="submit"
          className={`w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-black dark:bg-white dark:hover:bg-zinc-300 dark:focus:ring-zinc-800`}
        >
          Create an account
        </button>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-white hover:underline dark:text-white"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
