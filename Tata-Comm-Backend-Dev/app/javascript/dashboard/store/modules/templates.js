import TemplatesAPI from '../../api/templates';

export const actions = {
  get(_, params) {
    return TemplatesAPI.get(params);
  },
};

export default {
  namespaced: true,
  actions,
};
