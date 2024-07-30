import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoadingSpinner = () => (
  <div>
    <FontAwesomeIcon icon={faSpinner} spin />
  </div>
);

export default LoadingSpinner;