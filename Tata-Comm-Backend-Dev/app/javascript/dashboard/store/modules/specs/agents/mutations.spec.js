import * as types from '../../../mutation-types';
import { mutations } from '../../agents';

describe('#mutations', () => {
  describe('#SET_AGENTS', () => {
    it('set agent records', () => {
      const state = { records: [] };
      mutations[types.default.SET_AGENTS](state, [
        { id: 1, name: 'Agent1', email: 'agent1@tring.com' },
      ]);
      expect(state.records).toEqual([
        {
          id: 1,
          name: 'Agent1',
          email: 'agent1@tring.com',
        },
      ]);
    });
  });

  describe('#ADD_AGENT', () => {
    it('push newly created agent data to the store', () => {
      const state = {
        records: [{ id: 1, name: 'Agent1', email: 'agent1@tring.com' }],
      };
      mutations[types.default.ADD_AGENT](state, {
        id: 2,
        name: 'Agent2',
        email: 'agent2@tring.com',
      });
      expect(state.records).toEqual([
        { id: 1, name: 'Agent1', email: 'agent1@tring.com' },
        { id: 2, name: 'Agent2', email: 'agent2@tring.com' },
      ]);
    });
  });

  describe('#EDIT_AGENT', () => {
    it('update agent record', () => {
      const state = {
        records: [{ id: 1, name: 'Agent1', email: 'agent1@tring.com' }],
      };
      mutations[types.default.EDIT_AGENT](state, {
        id: 1,
        name: 'Agent2',
        email: 'agent2@tring.com',
      });
      expect(state.records).toEqual([
        { id: 1, name: 'Agent2', email: 'agent2@tring.com' },
      ]);
    });
  });

  describe('#DELETE_AGENT', () => {
    it('delete agent record', () => {
      const state = {
        records: [{ id: 1, name: 'Agent1', email: 'agent1@tring.com' }],
      };
      mutations[types.default.DELETE_AGENT](state, 1);
      expect(state.records).toEqual([]);
    });
  });

  describe('#UPDATE_AGENTS_PRESENCE', () => {
    it('updates agent presence', () => {
      const state = {
        records: [
          {
            id: 1,
            name: 'Agent1',
            email: 'agent1@tring.com',
            availability_status: 'offline',
          },
          {
            id: 2,
            name: 'Agent1',
            email: 'agent1@tring.com',
            availability_status: 'online',
          },
        ],
      };

      mutations[types.default.UPDATE_AGENTS_PRESENCE](state, { '1': 'busy' });
      expect(state.records).toEqual([
        {
          id: 1,
          name: 'Agent1',
          email: 'agent1@tring.com',
          availability_status: 'busy',
        },
        {
          id: 2,
          name: 'Agent1',
          email: 'agent1@tring.com',
        },
      ]);
    });
  });
});
