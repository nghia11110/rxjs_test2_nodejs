var observable = Rx.Observable.create(function (observer) {
  observer.next(1);
  setTimeout(() => {
    observer.next(2);
    observer.completed();
    observer.next(3);
  }, 1000);
});
/* With an observer */
var observer = Rx.Observer.create(
  function (x) {
    console.log('Next: %s', x);
  },
  function (err) {
    console.log('Error: %s', err);
  },
  function () {
    console.log('Completed');
  });

console.log('just before subscribe');
observable.subscribe(observer);
console.log('just after subscribe');