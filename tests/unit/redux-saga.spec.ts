import Vue from 'vue';
import Vuex, { Store, ActionContext, Action } from 'vuex';
import SagaPlugin from '@/store/plugins/saga';
import { take, put } from 'redux-saga/effects';

Vue.use(Vuex);

// Prevent vuex throw `unknown action type`
process.env.NODE_ENV = 'production';

const ACTION_SAGA = 'ACTION_SAGA';
const ACTION_MAIN = 'ACTION_MAIN';

function* messageSaga() {
    while (true) {
        const { payload } = yield take(ACTION_SAGA);
        console.log(payload);
        yield put({ type: ACTION_MAIN, payload });
    }
}

describe('redux-saga', () => {
    test('vuex', () => {
        const result = 'hello world';
        const saga = SagaPlugin<any>();
        const store = new Store({
            state: {
                title: 'hello world'
            },
            actions: {
                [ACTION_MAIN](
                    context: ActionContext<any, any>,
                    payload: string
                ) {
                    expect(payload).toEqual(result);
                }
            },
            plugins: [saga.plugin]
        });
        saga.run(messageSaga);
        store.dispatch(ACTION_SAGA, result);
    });
});
