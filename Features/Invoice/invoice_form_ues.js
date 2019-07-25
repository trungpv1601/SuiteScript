/**
 *
 * Invoice Form User Event Script
 *
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @author trungpv <trung@lexor.com>
 */
define(["N/record", "./Module/marginBalance"], function(record, marginBalance) {
    function beforeLoad(context) {
        const type = context.type;
        if (type !== context.UserEventType.CREATE) return;
        var invoiceRecord = context.newRecord;
        if (invoiceRecord.type === "invoice") {
            try {
                // saleseffectivedate
                const saleOrderId = invoiceRecord.getValue("createdfrom");
                if (saleOrderId) {
                    var so = record.load({
                        type: record.Type.SALES_ORDER,
                        id: saleOrderId,
                        isDynamic: true
                    });
                    const saleseffectivedate = so.getValue("saleseffectivedate");
                    invoiceRecord.setValue({
                        fieldId: "saleseffectivedate",
                        value: saleseffectivedate
                    });
                }
            } catch (error) {
                log.error({
                    title: "---- Error beforeLoad Invoice " + invoiceRecord.id,
                    details: error.message
                });
            }
        }
    }

    function afterSubmit(context) {
        var invoiceRecord = context.newRecord;
        if (invoiceRecord.type === "invoice") {
            try {
				const saleOrderId = invoiceRecord.getValue("createdfrom");
				marginBalance.updateSO(saleOrderId);
            } catch (error) {
                log.error({
                    title: "---- Error afterSubmit Invoice " + invoiceRecord.id,
                    details: error.message
                });
            }
        }
    }

    return {
        beforeLoad: beforeLoad,
        afterSubmit: afterSubmit
    };
});