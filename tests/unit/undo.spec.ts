import Vue from 'vue';
import Vuex, { ActionContext, Dispatch } from 'vuex';
import undoPlugin from '@/store/plugins/undo';
import {
    ACTION_EXEC_COMMAND,
    ACTION_REDO,
    ACTION_UNDO
} from '../../src/store/plugins/undo/plugin';

describe('undo plugin', () => {
    test('sync undo', () => {
        Vue.use(Vuex);

        const prevValue = 'hello world';
        const curValue = 'hello world, elgine';
        const store = new Vuex.Store({
            state: {
                title: prevValue
            },
            mutations: {
                setTitle(state: { title: string }, v: string) {
                    state.title = v;
                }
            },
            actions: {
                titleChanged(
                    { commit }: ActionContext<any, any>,
                    payload: string
                ) {
                    commit('setTitle', payload);
                }
            },
            plugins: [undoPlugin()]
        });

        class ChangeTitleCommand {
            private _dispatch: Dispatch;
            private _prevState: string;
            private _curState: string;

            constructor(
                dispatch: Dispatch,
                prevState: string,
                curState: string
            ) {
                this._dispatch = dispatch;
                this._prevState = prevState;
                this._curState = curState;
            }

            undo() {
                this._dispatch('titleChanged', this._prevState);
            }

            redo() {
                this._dispatch('titleChanged', this._curState);
            }
        }

        const command = new ChangeTitleCommand(
            store.dispatch,
            prevValue,
            curValue
        );

        store.dispatch(ACTION_EXEC_COMMAND, command);

        store.subscribeAction({
            after: ({ type }) => {
                if (type === ACTION_REDO) {
                    expect(store.state.title).toEqual(curValue);
                } else if (type === ACTION_UNDO) {
                    expect(store.state.title).toEqual(prevValue);
                    store.dispatch(ACTION_REDO);
                }
            }
        });
        store.dispatch(ACTION_UNDO);
    });
});
