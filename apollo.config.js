module.exports = {
  client: {
    tagName: "gql",
    includes: ["./src/**/*.tsx"],
    service: {
      name: "places-backend",
      url: "http://localhost:4000/graphql",
    },
  },
};
