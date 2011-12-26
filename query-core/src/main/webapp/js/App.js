App =  Ext.extend(Ext.Viewport, {

    /* i18n */
    queriesTitle: "1. Queries",
    resultsTitle: "2. Results",
    downloadsTitle: "3. Downloads",
    fileDownloadMessage: "This file is already set for download",
    homeTitle: "ICOS Spain Carbon Data Portal",
    homeLogin: "Login",
    homeCreateUser: "Sign Up",
    homeLogout: "Logout",
    homeUpdateUser: "Change Password",
    /* ~i18n */
    
    vocabulary: null,
    dataRecordType: null,
    queryForm: null,
    resultGrid: null,
    downloadPanel: null,
    user: null,
    
    initComponent: function() {
        // TODO: Manage state & session
        //Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
        
        Ext.QuickTips.init();
        
        this.setHomeLocale();
        
        this.user = new Authentication(/*{
            listeners: {
                logged_in: function(username) {
                    alert("Welcome, " + username + "!");
                },
                logged_out: function() {
                    alert("See you!");
                }
            }
        }*/);
        
        this.vocabulary = new Ext.data.XmlStore({
            url: 'xml/vocabulario.xml',
            record: 'term',
            idPath: 'nc_term',
            fields: [
                 'sado_term', 'nc_term', 'nc_long_term', 'en_term', 'en_long_term',
                 'nc_units', 'nc_data_type', 'nc_coordinate_axis_type'
            ],
            sortInfo: {
                field: 'nc_long_term',
                direction: 'ASC'
            }
        });
        
        this.dataRecordType = Ext.data.Record.create ([
            'id',
            'title',
            'summary',
            'institution',
            'creator_url',
            'data_type',
            'icos_domain',
            'geo_extent',
            {name: 'start_time', type: 'date'},
            {name: 'end_time', type: 'date'},
            'variables',
            'data_link'
        ]);

        this.queryById = new query.Identifier({
            listeners: {
                scope: this,
                render: function(form) {
                    form.buttons[0].on({
                        scope: this,
                        click: this.doLoadDataset
                    });
                }
            }
        });

        this.queryForm = new query.Form({
            vocabulary: this.vocabulary,
            listeners: {
                scope: this,
                render: function(form) {
                    form.buttons[0].on({
                        scope: this,
                        click: this.doQuery
                    });
                }
            }
        });
        
        this.vocabulary.load();
        
        this.resultGrid = new result.Grid({
            vocabulary: this.vocabulary,
            recordType: this.dataRecordType,
            downloadHandler: function(grid, rowIndex, colIndex) {
                var id = grid.store.getAt(rowIndex).get("id");
                this.addRecordToDownload(grid.store.getAt(rowIndex));
            },
            handlerScope: this
        });
        
        this.downloadPanel = new download.Panel({
            recordType: this.dataRecordType,
            user: this.user
        });
        
        var config = {
            layout: 'border',
            items: [{
                contentEl: 'header',
                region: 'north',
                xtype: 'box',
                height: 64
            }, {
                title: this.queriesTitle,
                region: 'west',
                split: false,
                width: 287,
                collapsible: true,
                layout: {
                    type: 'vbox',
                    align:'stretch',
                    animate: true
                },
                items: [
                    this.queryById,
                    this.queryForm
                ]
            }, {
                title: this.resultsTitle,
                region: 'center',
                layout: 'fit',
                items: [
                    this.resultGrid
                ],
                autoScroll: true
            }, {
                title: this.downloadsTitle,
                region: 'east',
                layout: 'fit',
                split: false,
                width: 287,
                items: [
                    this.downloadPanel
                ]
            }]
        };
        
        Ext.apply(this, Ext.apply(this.initialConfig, config));
        App.superclass.initComponent.apply(this, arguments);
    },

    doQuery: function() {
        this.resultGrid.load(this.queryForm.getParams());
    },

    doLoadDataset: function() {
        this.resultGrid.store.removeAll();
        this.downloadPanel.store.removeAll();
        this.resultGrid.load(this.queryById.getParams(), {
            callback: function() {
                // Propagate records to download list
                this.resultGrid.store.each(function(record) {
                    this.addRecordToDownload(record);
                }, this);
            },
            scope: this
        });
    },
    
    addRecordToDownload: function(record, silent) {
        var clonedRecord = record.copy();
        if(this.downloadPanel.store.getById(clonedRecord.id)) {
            alert(this.fileDownloadMessage);
        } else {
            this.downloadPanel.store.add(clonedRecord);
        }
    },
    
    setHomeLocale: function() {
        Ext.get("title").update(this.homeTitle);
        Ext.get("login").update(this.homeLogin);
        Ext.get("createUser").update(this.homeCreateUser);
        Ext.get("logout").update(this.homeLogout);
        Ext.get("updateUser").update(this.homeUpdateUser);
    }
    
});

Ext.reg('i_app', App);
