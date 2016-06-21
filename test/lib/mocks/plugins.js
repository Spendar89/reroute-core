import expect from 'expect';
import { createTestPlugin } from './../helpers';


export default {
  ...createTestPlugin('a'),
  ...createTestPlugin('b')
};
