import { mount, createLocalVue } from '@vue/test-utils';
import VueMarkdown               from './VueMarkdown.vue';
import $style                    from 'identity-obj-proxy';

const localVue = createLocalVue();

describe('VueMarkdown.vue', () => {

  test('renders component', () => {
    const wrapper = mount(VueMarkdown, {
      localVue,
      mocks: { $style },
      slots: {
        default: ['# foo', '## bar\n ### baz'],
      },
    });

    expect(wrapper.find('h1').text()).toBe('foo');
    expect(wrapper.find('h2').text()).toBe('bar');
    expect(wrapper.find('h3').text()).toBe('baz');
  });

});
