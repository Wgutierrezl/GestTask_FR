import axios from "axios";

const auth0Api = axios.create({
  baseURL: "http://alb-gesttask-1697059265.us-east-1.elb.amazonaws.com:8098/prod",
});

export default auth0Api;