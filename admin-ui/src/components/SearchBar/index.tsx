import { Input } from 'antd';
import type { SearchProps } from 'antd/lib/input';
import styles from './index.less';

const SearchBar = (props: SearchProps): JSX.Element => (
  <Input.Search enterButton {...props} className={styles.search} />
);

export default SearchBar;
