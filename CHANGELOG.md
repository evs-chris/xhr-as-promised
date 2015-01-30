## 0.1.1

* __BUG:__ Fixes typo that caused an exception trying to come up with a content type for posts that lack headers.

## 0.1.0

* More flexible option handling, including support for `responseType` and options for each helper.
* __BUG?:__ JSON helpers only parse the JSON if the response `Content-Type` contains `'json'`.

## 0.0.4

* __BUG?:__ JSON helpers now expect objects instead of pre-strinified JSON.
* __BUG:__ JSON helpers set the proper content type headers.
* There is now a `type` request option to set the content type more easily.

## 0.0.3

* __BUG:__ Fixes yet another issue caused by late-night git pushes.

## 0.0.2

* __BUG:__ Fixes stupid typo that completely broke receiving responses.

## 0.0.1

Initial version
