/**
 * REST API for Search Employee Email
 *
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @author trungpv <trung@lexor.com>
 */
define(['N/search'], function(search) {
	/**
	 * GET
	 * @param {*} context
	 */
	function getAction(context) {
		var result = {};
		result.success = false;

		try {
			const validation = doValidation([context.keyword], ['keyword'], 'GET');
			if (validation.length === 0) {
				var searchPayload = search.create({
					type: search.Type.EMPLOYEE,
					filters: [['isinactive', search.Operator.IS, 'F']],
					columns: ['email', 'firstname', 'middlename', 'lastname']
				});
				var employeeSearch = searchPayload.run().getRange({
					start: 0,
					end: 1000
				});
				employeeArr = [];
				for (var index = 0; index < employeeSearch.length; index++) {
					var item = employeeSearch[index];
					employeeArr.push({
						name: getName(
							item.getValue('firstname'),
							item.getValue('middlename'),
							item.getValue('lastname')
						),
						email: item.getValue('email')
					});
				}
				result.count = employeeArr.length;
				result.data = employeeArr;
				result.success = true;
				result.message = 'Success!';
			} else {
				result.message = 'Something went wrong with your params.';
				result.errors = validation;
			}
		} catch (err) {
			result.message = err.message;
		}
		return result;
	}

	/** HEPPER FUNCTIONS **/
	/**
	 * Convert Name
	 * @param {*} firstname
	 * @param {*} middlename
	 * @param {*} lastname
	 */
	function getName(firstname, middlename, lastname) {
		var name = '';
		name += firstname !== '' ? firstname : '';
		name += middlename !== '' ? ' ' + middlename : '';
		name += lastname !== '' ? ' ' + lastname : '';
		return name;
	}
	/**
	 * Validation params
	 * @param {*} args
	 * @param {*} argNames
	 * @param {*} methodName
	 */
	function doValidation(args, argNames, methodName) {
		const result = [];
		for (var i = 0; i < args.length; i++) {
			if (!args[i] && args[i] !== 0) {
				result.push('Missing a required argument: [' + argNames[i] + '] for method: ' + methodName);
			}
		}
		return result;
	}
	/**
	 * Export Events
	 */
	var exports = {};
	exports.get = getAction;
	return exports;
});
