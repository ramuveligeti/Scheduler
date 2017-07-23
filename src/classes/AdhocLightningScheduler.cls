public class AdhocLightningScheduler{
    @auraEnabled public List<filterWrapper> filWrapList;
    @auraEnabled public static Boolean showFields{get;set;}
    //@auraEnabled public static Map<String, Schema.SObjectType> schemaMap{get;set;}
    public AdhocLightningScheduler(){
        //schemaMap = Schema.getGlobalDescribe();
        filWrapList = new List<filterWrapper>();
    }

    @auraEnabled
    public static List<SelectOption> getSobjectNames(){
        List<String> oNames = new List<String>();
        List<SelectOption> objNames = new List<SelectOption>();
        Map<String,String> oMap = new Map<String,String>();
        objNames.add(new SelectOption('','--None--'));
        for(Schema.SObjectType o : Schema.getGlobalDescribe().values()){
            Schema.DescribeSObjectResult objResult = o.getDescribe();
            String label = objResult.getLabel();
            String name = objResult.getName();
            if (!objResult.isCustomSetting() && objResult.getRecordTypeInfos().size() > 0 && objResult.isCreateable() &&
                !name.containsignorecase('history') && !name.containsignorecase('tag') && !name.containsignorecase('share') && 
                !name.containsignorecase('feed')) {
                    oNames.add(label);
                    oMap.put(label,name);
            }
        }
        oNames.sort();
        system.debug('oNames=='+oNames);
        for(String s: oNames){
            objNames.add(new SelectOption(oMap.get(s),s));
        }
        return objNames;
    }
    
    @auraEnabled
    public static List<SelectOption> getChildRelations(String so){
        Schema.SObjectType objSchema = Schema.getGlobalDescribe().get(so);
        List<SelectOption> objNames = new List<SelectOption>();
        objNames.add(new SelectOption('','--None--'));
        system.debug('a=='+objSchema.getDescribe().getChildRelationships());
        for(Schema.ChildRelationship o : objSchema.getDescribe().getChildRelationships()){
            objNames.add(new SelectOption(o.getChildSObject().getDescribe().getLabel(),String.valueOf(o.getChildSObject())));
        }
        return objNames;
    }

    @AuraEnabled
    public static List<List<String>> getSelectOptions(String sobj, String fieldName) {
        List<List<String>> options = new List<List<String>>();
        Schema.DescribeFieldResult d = Schema.getGlobalDescribe().get(sobj).getDescribe().fields.getMap()
            .get(fieldName).getDescribe();
        
        List<Schema.PicklistEntry> pv = d.getPickListValues();
        for (Schema.PicklistEntry a : pv) {
            List<String> l = new List<String>();
            l.add(a.getLabel());
            l.add(a.getValue());
            options.add(l);
        }
        
        return options;
    }

    @auraEnabled
    public static List<List<String>> getObjFields(String so){
        system.debug('s=='+so);
        Schema.SObjectType objSchema = Schema.getGlobalDescribe().get(so);
        Map<String, Schema.SObjectField> fieldMap = objSchema.getDescribe().fields.getMap();
        List<List<String>> options = new List<List<String>>();
        List<String> l1 = new List<String>();
        l1.add('--None--');
        l1.add('');
        options.add(l1);
        if(String.isBlank(so)){
            return null;
        }
        //objFields.add(new SelectOption('','--None--'));
        for(Schema.SObjectField s1:fieldMap.values()){
            List<String> l = new List<String>();
            string field = String.valueOf(s1);
            //get label
            l.add(String.valueOf(s1.getDescribe().getName()));
            
            String dataType = String.valueOf(fieldMap.get(field).getDescribe().getType());
            String objName = '';
            //get API Name +'=='+ data type+'~:~'+ Reference field object Name
            if(dataType == 'REFERENCE'){
                objName = String.valueOf(fieldMap.get(field).getDescribe().getReferenceTo()[0].getDescribe().getName());
                l.add(field+'=='+dataType+'~:~'+objName);
            }
            //get API Name +'=='+ data type
            else l.add(field+'=='+dataType+'~:~'+objName);
            options.add(l);
            //objFields.add(new SelectOption(field+'=='+String.valueOf(fieldMap.get(field).getDescribe().getType()),String.valueOf(s1.getDescribe().getName())));
        }
        return options;
    }

    @auraEnabled
    public static List<List<String>> getRefObjFields(String so, String fldName){
        system.debug('s=='+so+'=='+fldName);
        Schema.SObjectType objSchema = Schema.getGlobalDescribe().get(so);
        Map<String, Schema.SObjectField> fieldMap = objSchema.getDescribe().fields.getMap().get(fldName).getDescribe().getReferenceTo()[0].getDescribe().fields.getMap();
        List<List<String>> options = new List<List<String>>();
        List<String> l1 = new List<String>();
        l1.add('--None--');
        l1.add('');
        options.add(l1);
        if(String.isBlank(so)){
            return null;
        }
        //objFields.add(new SelectOption('','--None--'));
        for(Schema.SObjectField s1:fieldMap.values()){
            List<String> l = new List<String>();
            string field = String.valueOf(s1);
            l.add(String.valueOf(s1.getDescribe().getName()));
            l.add(field+'=='+String.valueOf(fieldMap.get(field).getDescribe().getType()));
            options.add(l);
            //objFields.add(new SelectOption(field+'=='+String.valueOf(fieldMap.get(field).getDescribe().getType()),String.valueOf(s1.getDescribe().getName())));
        }
        return options;
    }

    @auraEnabled
    public static list<List<String>> getPicklistValues(String so, String fld){
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(so);
        Sobject Object_name = targetType.newSObject();
        // Get the object type of the SObject.
        Schema.sObjectType objType = Object_name.getSObjectType();
        // Describe the SObject using its object type.
        Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
        // Get a map of fields for the SObject
        map<String, Schema.SObjectField> fieldMap1 = objDescribe.fields.getMap();
        // Get the list of picklist values for this field.
        list<Schema.PicklistEntry> values = fieldMap1.get(fld).getDescribe().getPickListValues();
        List<List<String>> options = new List<List<String>>();
        List<String> l1 = new List<String>();
        l1.add('--None--');
        l1.add('');
        options.add(l1);
        // Add these values to the selectoption list.
        for (Schema.PicklistEntry a : values){
            List<String> l = new List<String>();
            l.add(a.getLabel());
            l.add(a.getValue());
            options.add(l);
        }
        return options;
    }
    
    @auraEnabled
    public static list<List<String>> lookupObject(String so, String fldName, String searchtxt){
        system.debug('so=='+so+'=='+fldName+'=='+searchtxt);
        string fd = fldName.split('==')[0];
        List<List<String>> options = new List<List<String>>();
        Schema.SObjectType objSchema = Schema.getGlobalDescribe().get(so);
        String refObj = String.valueOf(objSchema.getDescribe().fields.getMap().get(fd).getDescribe().getReferenceTo()[0]);
        MetadataService.MetadataPort service = new MetadataService.MetadataPort();
        service.SessionHeader = new MetadataService.SessionHeader_element();
        service.SessionHeader.sessionId = ApexUtils.getSessionIdFromVFPage(Page.SessionId);
        MetadataService.CustomObject customObject = (MetadataService.CustomObject) service.readMetadata('CustomObject', new String[] { 'Account' }).getRecords()[0];
        List<String> ld = customObject.SearchLayouts.lookupDialogsAdditionalFields;
        for(integer i=0;i<ld.size();i++){
            system.debug('refObj=='+refObj+'=='+ld[i]+'==='+ld[i].containsIgnoreCase(refObj));
            if(ld[i].containsIgnoreCase(refObj)){ld[i] = ld[i].replace(refObj.toUpperCase()+'.', '');}
            ld[i] = ld[i].replace('CORE.USERS', 'OWNER');
            system.debug('ld=='+ld[i]);
        }
        String fields = String.join(ld,',');
        fields = fields.replace('CORE.USERS', 'OWNER');
        String query = 'Select Id,'+fields+' from '+refObj+' where Name like \'%'+searchtxt+'%\' limit 5';
        List<sObject> sList = Database.query(query);
        List<String> l1 = new List<String>();
        for(String s: ld){
            l1.add(s);
        }
        options.add(l1);
        for(sObject so1: sList){
            List<String> l = new List<String>();
            l.add(String.valueOf(so1.get('Id')));
            for(String s: ld){
                if(s.containsIgnoreCase('OWNER')){l.add(String.valueOf(so1.getSobject(s.split('\\.')[0]).get(s.split('\\.')[1])));}
                else {
                    system.debug('SS=='+s+'=='+so1.get(s));
                    if(so1.get(s) == null){l.add('');}
                    else l.add(String.valueOf(so1.get(s)));
                }
            }
            options.add(l);
        }
        system.debug('optiaons=='+options);
        return options;
    }

    @auraEnabled
    public static void saveScheduler(String schJson){
        system.debug(schJson);
        Scheduler sch = (Scheduler)JSON.deserialize(schJson, Scheduler.class);
        system.debug(sch);
        Scheduler__c s = new Scheduler__c();
        s.Filter_Wrapper_JSON__c = JSON.serialize(sch.filterWrapper);
        s.Object__c = sch.filterWrapper[0].selectedObject;
        insert s;

        List<Scheduler_Action__c> saList = new List<Scheduler_Action__c>();
        for(ActionWrap a: sch.actionWrap){
            Scheduler_Action__c sa = new Scheduler_Action__c();
            sa.Action_Wrapper_JSON__c = JSON.serialize(a);
            sa.Scheduler__c = s.Id;
            sa.Occurrence__c = a.occurrence;
            sa.Frequency__c = a.selectedFrequency;
            sa.Schedule_Datetime__c = a.filterDate;
            sa.Filter_Wrapper_JSON__c = JSON.serialize(a.filterWrapper);
            sa.Related_Filter_Wrapper_JSON__c = JSON.serialize(a.relFilterWrapper);
            sa.Action_Type__c = a.selectedAction;
            sa.Related_Object__c = a.selectedObject;
            saList.add(sa);
        }

        if(!saList.isEmpty()) insert saList;
    }

    @auraEnabled
    public static String getScheduler(String recId){
        Scheduler__c sch = [Select Filter_Wrapper_JSON__c,Object__c, 
                            (Select Action_Wrapper_JSON__c,Occurrence__c,Frequency__c,Schedule_Datetime__c,Filter_Wrapper_JSON__c,Related_Filter_Wrapper_JSON__c,Action_Type__c,Related_Object__c 
                                            from Scheduler_Actions__r) 
                            from Scheduler__c where Id= :recId];

        return JSON.serialize(sch);
    }
    
	public class Operators {
		@auraEnabled public String label {get;set;} 
		@auraEnabled public String value {get;set;} 
		@auraEnabled public Boolean selected {get;set;} 
    }
    
	public class ActionWrap {
		@auraEnabled public List<Operators> action {get;set;} 
		@auraEnabled public Integer lineNumber {get;set;} 
		@auraEnabled public Integer index {get;set;} 
		@auraEnabled public String selectedAction {get;set;} 
		@auraEnabled public Datetime filterDate {get;set;}
		@auraEnabled public String selectedObject {get;set;} 
		@auraEnabled public Boolean dispRelList {get;set;} 
		@auraEnabled public Boolean dispRelWrap {get;set;} 
		@auraEnabled public String fields {get;set;}
		@auraEnabled public List<FilterWrapper> relFilterWrapper {get;set;} 
		@auraEnabled public List<FilterWrapper> filterWrapper {get;set;} 
		@auraEnabled public String selectedRefPar {get;set;} 
		@auraEnabled public List<Operators> frequency {get;set;} 
		@auraEnabled public String occurrence {get;set;} 
		@auraEnabled public String selectedFrequency {get;set;} 
		@auraEnabled public Boolean updateRec {get;set;} 
		@auraEnabled public Boolean noCriteria {get;set;} 
    }

	public class FilterWrapper {
		@auraEnabled public String selectedObject {get;set;}
		@auraEnabled public String triggerAction {get;set;} 
		@auraEnabled public Integer actionIndex {get;set;} 
		@auraEnabled public String selectedField {get;set;} 
		@auraEnabled public String selectedOperator {get;set;} 
		@auraEnabled public String selectedValue {get;set;} 
		@auraEnabled public String selectedValueId {get;set;} 
		@auraEnabled public List<Operators> operators {get;set;} 
		@auraEnabled public List<PicklistVals> picklistVals {get;set;} 
		@auraEnabled public String dataType {get;set;} 
		@auraEnabled public String filterDate {get;set;} 
		@auraEnabled public Integer index {get;set;} 
		@auraEnabled public Integer lineNumber {get;set;} 
		@auraEnabled public Boolean dispAdd {get;set;} 
		@auraEnabled public Boolean dispRem {get;set;} 
    }

	public class PicklistVals {
		@auraEnabled public String label {get;set;} 
		@auraEnabled public String value {get;set;} 
    }

	public class Scheduler {
		//public String sObj {get;set;} 
		public List<FilterWrapper> filterWrapper {get;set;} 
		public List<ActionWrap> actionwrap {get;set;} 
    }

    public class SelectOption {
        public SelectOption(String value, String label) {
            this.value = value;
            this.label = label;
            this.disabled = false;
            this.escapeItem = false;
        }
    
        public SelectOption(String value, String label, Boolean isDisabled) {
            this.value = value;
            this.label = label;
            this.disabled = isDisabled;
            this.escapeItem = false;
        }
    
        @AuraEnabled
        public String label { get;set; }
        @AuraEnabled
        public String value { get;set; }
        @AuraEnabled
        public Boolean disabled { get;set; }
        @AuraEnabled
        public Boolean escapeItem { get;set; }
    
    }    
}