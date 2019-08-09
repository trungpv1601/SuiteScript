define(["N/search", "/SuiteScripts/lib/autocomplete"], function(
  search,
  autocomplete
) {
  /**
   * Call Center Lead Form
   * @NApiVersion 2.x
   * @NScriptType ClientScript
   * @author trungpv <trung@lexor.com>
   */

  /* === VARS === */

  /* === EVENTS FUNCTIONS === */

  /**
   * Sublist Changed
   * @param {*} context
   */
  function sublistChanged(context) {
    const currentRecord = context.currentRecord;
    const sublistId = context.sublistId;
    const operation = context.operation;

    if (sublistId === "addressbook") {
      const defaultbilling = currentRecord.getCurrentSublistValue({
        sublistId: sublistId,
        fieldId: "defaultbilling"
      });
      const defaultshipping = currentRecord.getCurrentSublistValue({
        sublistId: sublistId,
        fieldId: "defaultshipping"
      });

      if (operation === "remove") {
        // Reset Default Value when remove address
        if (defaultbilling) {
          currentRecord.setValue({
            fieldId: "defaultaddress",
            value: ""
          });
        }
        if (defaultshipping) {
          currentRecord.setValue({
            fieldId: "custentity_address_verification",
            value: ""
          });
        }
      } else {
        if (defaultshipping) {
          const addressbookaddress_text = currentRecord.getCurrentSublistValue({
            sublistId: sublistId,
            fieldId: "addressbookaddress_text"
          });
          var addressArr = addressbookaddress_text.split("\n");
          if (addressArr.length > 3) {
            currentRecord.setValue({
              fieldId: "custentity_address_verification",
              value: formatAddressStandardization(addressbookaddress_text)
            });
          } else {
            currentRecord.setValue({
              fieldId: "custentity_address_verification",
              value: ""
            });
          }
        }
      }
    }
  }

  /**
   * Page Init
   * @param {*} context
   */
  function pageInit(context) {
    const currentRecord = context.currentRecord;
    loadCSSText(
      ".autocomplete{background:#fff;z-index:1000;overflow:auto;box-sizing:border-box;border:1px solid #ccc;font-size:13px}.autocomplete>div{padding:5px 5px;border-bottom:1px solid #ccc}.autocomplete .group{background:#eee}.autocomplete>div.selected,.autocomplete>div:hover:not(.group){background:#607799;cursor:pointer;color:#fff}"
    );

    // var input = document.getElementById('custentity_search_phone');
    var mobilephone = document.getElementById("mobilephone");
    autocomplete({
      input: mobilephone,
      fetch: function(text, update) {
        // Start Search
        const types = ["Customer", "Lead", "Prospect"];
        search.global
          .promise({
            keywords: text
          })
          .then(function(result) {
            var promises = [];
            result = arrayFilter(result, function(o) {
              if (
                (o.getValue({
                  name: "info1"
                }) !== "" ||
                  o.getValue({
                    name: "info2"
                  }) !== "") &&
                types.includes(
                  o.getValue({
                    name: "type"
                  })
                )
              ) {
                promises.push(
                  search.lookupFields.promise({
                    type: o.recordType,
                    id: o.id,
                    columns: [
                      "firstname",
                      "middlename",
                      "lastname",
                      "companyname",
                      "salesrep",
                      "entitystatus"
                    ]
                  })
                );
                return o;
              }
            });
            Promise.all(promises)
              .then(function(results) {
                for (var index = 0; index < result.length; index++) {
                  var el = result[index];
                  var name = el.getValue({
                    name: "name"
                  });
                  var type = el.getValue({
                    name: "type"
                  });
                  var info1 = el.getValue({
                    name: "info1"
                  });
                  var info2 = el.getValue({
                    name: "info2"
                  });
                  results[index].id = el.id;
                  results[index].name = name;
                  results[index].type = type;
                  results[index].info1 = info1;
                  results[index].info2 = info2;
                }
                update(results);
              })
              .catch(function onRejected(reason) {});
          })
          .catch(function onRejected(reason) {});
      },
      render: function(element, currentValue) {
        var div = document.createElement("div");
        var formatStr =
          '<p>' + element.type + ': <strong style="font-weight: bold;">' +
          element.name +
          "</strong></p>";
        formatStr +=
          '<p>Name: <strong style="font-weight: bold;">' +
          getName(element.firstname, element.middlename, element.lastname) +
          (element.companyname ? " (" + element.companyname + ")" : "") +
          "</strong></p>";
        formatStr +=
          '<p>Status: <strong style="font-weight: bold;">' +
          (element.entitystatus.length > 0
            ? element.entitystatus[0].text
            : "None") +
          "</strong></p>";
        formatStr +=
          '<p>Sales Rep: <strong style="font-weight: bold;">' +
          (element.salesrep.length > 0 ? element.salesrep[0].text : "None") +
          "</strong></p>";
        formatStr +=
          '<p>Phone: <strong style="font-weight: bold;">' +
          element.info2 +
          "</strong></p>";
        div.innerHTML = formatStr;
        return div;
      },
      onSelect: function(item) {
        NS.jQuery("#mobilephone").val("");
        window.open("/app/common/entity/custjob.nl?id=" + item.id, "_blank");
      }
    });

    var phone = document.getElementById("phone");
    autocomplete({
      input: phone,
      fetch: function(text, update) {
        // Start Search
        const types = ["Customer", "Lead", "Prospect"];
        search.global
          .promise({
            keywords: text
          })
          .then(function(result) {
            var promises = [];
            result = arrayFilter(result, function(o) {
              if (
                (o.getValue({
                  name: "info1"
                }) !== "" ||
                  o.getValue({
                    name: "info2"
                  }) !== "") &&
                types.includes(
                  o.getValue({
                    name: "type"
                  })
                )
              ) {
                promises.push(
                  search.lookupFields.promise({
                    type: o.recordType,
                    id: o.id,
                    columns: [
                      "firstname",
                      "middlename",
                      "lastname",
                      "companyname",
                      "salesrep",
                      "entitystatus"
                    ]
                  })
                );
                return o;
              }
            });
            Promise.all(promises)
              .then(function(results) {
                for (var index = 0; index < result.length; index++) {
                  var el = result[index];
                  var name = el.getValue({
                    name: "name"
                  });
                  var type = el.getValue({
                    name: "type"
                  });
                  var info1 = el.getValue({
                    name: "info1"
                  });
                  var info2 = el.getValue({
                    name: "info2"
                  });
                  results[index].id = el.id;
                  results[index].name = name;
                  results[index].type = type;
                  results[index].info1 = info1;
                  results[index].info2 = info2;
                }
                update(results);
              })
              .catch(function onRejected(reason) {});
          })
          .catch(function onRejected(reason) {});
      },
      render: function(element, currentValue) {
        var div = document.createElement("div");
        var formatStr =
          '<p>' + element.type + ': <strong style="font-weight: bold;">' +
          element.name +
          "</strong></p>";
        formatStr +=
          '<p>Name: <strong style="font-weight: bold;">' +
          getName(element.firstname, element.middlename, element.lastname) +
          (element.companyname ? " (" + element.companyname + ")" : "") +
          "</strong></p>";
        formatStr +=
          '<p>Status: <strong style="font-weight: bold;">' +
          (element.entitystatus.length > 0
            ? element.entitystatus[0].text
            : "None") +
          "</strong></p>";
        formatStr +=
          '<p>Sales Rep: <strong style="font-weight: bold;">' +
          (element.salesrep.length > 0 ? element.salesrep[0].text : "None") +
          "</strong></p>";
        formatStr +=
          '<p>Phone: <strong style="font-weight: bold;">' +
          element.info2 +
          "</strong></p>";
        div.innerHTML = formatStr;
        return div;
      },
      onSelect: function(item) {
        NS.jQuery("#phone").val("");
        window.open("/app/common/entity/custjob.nl?id=" + item.id, "_blank");
      }
    });

    return;
  }

  /** HELPER FUNCTIONS **/
  function formatAddressStandardization(address) {
    address = address.split("\n");
    var result = "";
    if (address.length >= 4) {
      address.splice(0, 1);
      //https://trello.com/c/wVD1x8Xc/185-urgent-default-shipping-problem
      // if (address.length === 4) {
      //   address.splice(1, 1);
      // }
    }

    result = address.join("\n");
    return result;
  }

  /**
   * Load CSS from Text
   * @param {*} str
   */
  function loadCSSText(str) {
    if (window.document) {
      var fileref = window.document.createElement("style");
      fileref.innerHTML = str;
      window.document.head.appendChild(fileref);
    }
  }

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  /**
   * Convert Name
   * @param {*} firstname
   * @param {*} middlename
   * @param {*} lastname
   */
  function getName(firstname, middlename, lastname) {
    var name = "";
    name += firstname !== "" ? firstname : "";
    name += middlename !== "" ? " " + middlename : "";
    name += lastname !== "" ? " " + lastname : "";
    return name;
  }

  /**
   * Export Events
   */
  var exports = {};
  exports.pageInit = pageInit;
  exports.sublistChanged = sublistChanged;
  return exports;
});
