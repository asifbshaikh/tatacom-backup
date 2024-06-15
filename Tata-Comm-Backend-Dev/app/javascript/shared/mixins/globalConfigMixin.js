export default {
  methods: {
    useInstallationName(str = '', installationName) {
      return str.replace(/Tring/g, installationName);
    },
  },
};
