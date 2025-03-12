const { getDefaultConfig } = require("expo/metro-config");
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push("mp3");
config.resolver.assetExts.push("ogg");

module.exports = wrapWithReanimatedMetroConfig(config);
