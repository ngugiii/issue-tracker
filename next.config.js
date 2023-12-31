// module.exports = {
//     webpack: (config, { isServer }) => {
//       if (!isServer) {
//         config.resolve.fallback = {
//           fs: false,
//           path: false,
//           os: false,
//           "@babel/runtime/regenerator": false, // Add this line
//         };
//       }
//       return config;
//     },
//   };
  
module.exports = {
    presets: ['next/babel'],
  };