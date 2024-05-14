import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JoblyApi {
  // the token for interactive with the API will be stored here.
  static token = localStorage.getItem('token');

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${JoblyApi.token}` };
    const params = (method === "get") ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get details on a company by handle. */

  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`);
    return res.company;
  }

  static async getCompanies(data = {}) {
    try {
      const response = await axios.get(`${BASE_URL}/companies`, { params: data });
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response || error);
      throw error;
    }
  }

  // obviously, you'll add a lot here ...

  /** Method to log in a user */
  static async login(username, password) {
    const res = await this.request("auth/token", { username, password }, "post");
    JoblyApi.token = res.token; // Save token to class
    localStorage.setItem('token', res.token); // Save token to localStorage
    return res;
  }

  /** Method to signup a new user */
  static async signup(userData) {
    const res = await this.request("auth/register", userData, "post");
    JoblyApi.token = res.token; // Save token to class
    localStorage.setItem('token', res.token); // Save token to localStorage
    return res;
  }

  /** Method to get user profile */
  static async getUser(username) {
    return await this.request(`users/${username}`);
  }


  /** Method to update user profile */

  static async updateUser(username, data) {
    return await this.request(`users/${username}`, data, "patch");
}
  
  /** Method to list all jobs */

  static async getJobs(data = {}) {
    return await this.request("jobs", data);
}


  /** Method to apply to a job */

  static async applyToJob(username, jobId) {
    return await this.request(`jobs/${jobId}/apply`, { username }, "post");
  }
}

// for now, put token ("testuser" / "password" on class)
JoblyApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
    "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
    "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";

export default JoblyApi;