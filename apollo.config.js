module.exports = {
  client: {
    includes: ["./src/**/*.{tsx,ts}"], // ./src/모든폴더/.tsx확장자를 가지는 모든 파일
    tagName: "gql",
    service: {
      name: "nuber-eats-back",
      url: "http://localhost:4000/graphql",
    },
  },
};
