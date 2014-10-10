/* **************************************************************

   Copyright 2011 Zoovy, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

************************************************************** */

var _store_pandbfashion = function(_app) {
	var r= {
		vars : {
			catTemplates : {
			},
			scrollPosHist : "",
			scrollPosBackHit : "",
			scrollPosArrayIndex : ""
		},
		
		callbacks : {
			init : {
				onSuccess : function(){
					
				},
				onError : function() {
					_app.u.dump('BEGIN _app.ext.ext_store_pandbfashion.callbacks.init.onError');
				}
			},
			startExtension : {
				onSuccess : function (){
					_app.u.dump('BEGIN _app.ext.ext_store_pandbfashion.callbacks.startExtension.onSuccess')
				},
				onError : function (){
					_app.u.dump('BEGIN _app.ext_store_pandbfashion.callbacks.startExtension.onError');
				}
			},
			productElasticSearchList : {
				onSuccess : function(responseData){
					//alert("hello");
					//_app.u.dump(responseData, "debug");
					
					$('.elasticlist', responseData.$context).anycontent({"templateID":"prodPageElasticTemplate","datapointer":"ProdPageElastic"});
					//alert($('.elasticlist', responseData.$context).html());
					},
				onError : function(){
					}
				}
		},
		
		
		////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {
			
			showDropdownBrand : function ($tag) {
				var $dropdown = $(".dropdown", $tag);
				var height = 548;
				$dropdown.stop().animate({"height":height+"px"}, 0);
			},
				
			hideDropdown : function ($tag) {
				$(".dropdown", $tag).stop().animate({"height":"0px"}, 0);
			},
			
			showReviewsModal : function(){
				$('#reviewModalContent').dialog({'modal':'true', 'title':'Product Reviews','width':950, height:500});
			},
			showInterShipWarning : function(val){
				//countrySelectorShipping
				//console.debug(val);
				
				//$("#countrySelectorShipping").val(val);
				//$("#countrySelectorBilling").val(val);
				
				//var $options = $("#countrySelectorBilling > option").clone();
				//$('#countrySelectorShipping').append($options);
				//_app.u.dump('Here is what is stored in countrySelectorBilling ' + abcd);
				
				if ($('#countrySelectorBilling').val() === "US"){
					$('#shippingWarning').hide();
					if ($('#countrySelectorShipping').val() === "US"){
					}
					else{
						$('#shippingWarning').show();
						$('#interShippingModal').dialog({'modal':'true', 'title':'','width':868, height:700, closeOnEscape: false, "dialogClass" : "intShippingModal"});
					}
				}
				else{
					$('#shippingWarning').show();
					$('#interShippingModal').dialog({'modal':'true', 'title':'','width':868, height:700, closeOnEscape: false, "dialogClass" : "intShippingModal"});
				}
				},
			interShipWarningAcceptClick : function(){
				if($('#interShipAgreeCheck').is(':checked')){
					$('#noCheckWarning').hide();
					$('#interShippingModal').dialog('close');
					$('.interShippingModalCont').css('height','1045px');
				}
				else
				{
					$('#noCheckWarning').show();
					$('.interShippingModalCont').css('height','1070px');
				}
			},
			closeDropdownOnClick : function($tag){
				//$('.dropdownOnClick').css({'height':'0px'});
				//$('.dropdownOnClick2').css({'height':'0px'});
				//$('.dropdownOnClick3').css({'height':'0px'});
				//$('.dropdownOnClick4').css({'height':'0px'});
				$(".dropdown", $tag).stop().animate({"height":"0px"}, 0);
			},
			scrollToTopPage : function(){
				$('html, body').animate({scrollTop : 0},1000);
				_app.u.dump("running function properly");
			},
			scrollToTopPage : function(scrollHeight){
				$('html, body').animate({scrollTop : scrollHeight},1000);
				_app.u.dump("running function properly");
			},
			
			//function for showing/hiding the bag it button after a quantity is entered.
			addToCartInventoryCheck : function(prodPid, input){
				//_app.u.dump(prodPid);
				var inventory = _app.ext.store_product.u.getProductInventory(prodPid);
				//_app.u.dump(inventory);
				if(input <= inventory){
					//display bag it button and allow them to proceed with checkout
				}
				else{
					//Display warning message that quantity requested is larger than quantity in stock.
				}
			},
			
			//function for adding a shipping insurance note
			addShippingInsurance : function(){
				var input = $(".chkoutOrderNotes ");
				
				if($('.shipInsurCB').is(':checked')){
					_app.u.dump("Box is checked, checking to see if note has been added already");
					if(input.val == "Please add shipping insurance to this order."){
						_app.u.dump("Note already added, do nothing.");
					}
					else{
						_app.u.dump("Note not added, adding not now.");
						input.val( input.val() + "Please add shipping insurance to this order." );
					}
				}
				else{
					_app.u.dump("Box unchecked, clearing out order notes.");
					$(".chkoutOrderNotes").val("");
				}
			}
			
		},
		
		renderFormats : {
			//Identical to the showIFSet render format but sets to inline instead of block.
			showIfSetInline : function($tag,data)	{
			if(data.value)	{
				$tag.show().css('display','inline'); //IE isn't responding to the 'show', so the display:inline is added as well.
				}
			},
			
			hideIfSetAlt : function($tag,data){
				_app.u.dump('Hide if set function running');
				if(data.value){
					_app.u.dump('Hiding .ordersNoOrdersMess');
					//$('.ordersNoOrdersMess').hide();
				}
				else{
					//_app.u.dump('Not hiding .ordersNoOrdersMess. Length is =< 0');
				}
			},
			
			//render format for displaying inventory value on the produt page.
			inventoryCount : function($tag,data){
				$tag.text(_app.ext.store_product.u.getProductInventory(data.value));
			},
			
			processListAlt : function($tag,data){
//			_app.u.dump("BEGIN renderFormats.processList");
			$tag.removeClass('loadingBG');
			if(data.bindData.loadsTemplate)	{
				var $o, //recycled. what gets added to $tag for each iteration.
				int = 0;
				for(var i in data.value)	{
					if(data.bindData.limit && int >= Number(data.bindData.limit)) {break;}
					else	{
						$o = _app.renderFunctions.transmogrify(data.value[i],data.bindData.loadsTemplate,data.value[i]);
						if(typeof $o == 'object')	{
							if(data.value[i].id){} //if an id was set, do nothing.
							else	{$o.attr('data-obj_index',i)} //set index for easy lookup later.
							$tag.append($o);
							}
						else	{
							$tag.anymessage({'message':'Issue creating template using '+data.bindData.loadsTemplate,'persistant':true});
							}
						}
					int += 1;				
					}
				
				}
			else	{
				$tag.anymessage({'message':'Unable to render list item - no loadsTemplate specified.','persistant':true});
				}
				//hides or shows the order message based on whether orders are present or not.
				_app.u.dump('Hide if set function running');
				if($('.orderHistoryList').children().length > 0){
					//_app.u.dump('Hiding .ordersNoOrdersMess');
					$('.ordersNoOrdersMess').hide();
				}
				else{
					//_app.u.dump('Showing .ordersNoOrdersMess. Length is =< 0');
					$('.ordersNoOrdersMess').show().css('display','block');
				}
			}
		}
	}
	return r;
}