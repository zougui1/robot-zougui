import { DateTime } from 'luxon';

(async () => {
  console.log(
    DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
  );
})();
