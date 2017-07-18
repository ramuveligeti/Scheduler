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

    //Wrapper for Filter Screen
    public class filterWrapper{
        @auraEnabled public String filterOption{get;set;}
        @auraEnabled public String filterOperator{get;set;}
        @auraEnabled public List<SelectOption> operators{get;set;}
        @auraEnabled public String value{get;set;}
        @auraEnabled public String lookupValue{get;set;}
        @auraEnabled public Scheduler__c sch{get;set;}
        @auraEnabled public Date dateValue{get;set;}
        @auraEnabled public Datetime datetimeValue{get;set;}
        @auraEnabled public String dataType{get;set;}
        @auraEnabled public list<SelectOption> picklistOptions{get;set;}
        @auraEnabled public Integer uniqueId{get;set;}
        @auraEnabled public String andOperator{get;set;}
        @auraEnabled public Integer sequence{get;set;}
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