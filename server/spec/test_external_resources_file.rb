
require_relative 'test_helper'

require 'minitest'
require 'minitest/autorun'
require 'minitest/unit'

require_relative '../external_resources_file'

# require 'webmock/minitest'

class TestExternalResourcesFile < Minitest::Test

  attr_accessor :resources_dir
  attr_accessor :erf
  # Called before every test method runs. Can be used
  # to set up fixture information.

  def setup
    @resources_dir = "../test-files/resources"
    @erf = ExternalResourcesFile.new(@resources_dir)
  end

  # Called after every test method runs. Can be used to tear
  # down fixture information.

  def teardown
    # Do nothing
  end

  #########################
  #### test public methods
  def test_constructor
    assert @erf, "creating external resources file object"
    assert_equal @erf.resources_base_directory, @resources_dir, "set external resources directory name correctly"
  end

  def test_list_resources_top
    parsed_file_list = JSON.parse(@erf.get_resource nil)
    assert_equal 2,parsed_file_list.length,"list resources in top level directory"
  end

  def test_list_resources_images
    parsed_file_list = JSON.parse(@erf.get_resource "images")
    assert_equal 7,parsed_file_list.length,"list resources in images directory"
  end

  def test_list_resources_text
    parsed_file_list = JSON.parse(@erf.get_resource "text")
    assert_equal 1, parsed_file_list.length,"list resources in text directory"
  end

  def test_get_resources_text
    body = @erf.get_resource "text","howdy.txt"
    assert body.length > 10 ,"get resource from text directory"
  end

  def test_get_resources_image
    body = @erf.get_resource "images","blue.png"
    assert body.length > 10000 ,"get resource from image directory"
  end

  def test_get_resources_image_missing
    body = @erf.get_resource "images","pogo.png"
    assert_equal nil, body ,"try to get missing resource from image directory"
  end

  def test_get_resources_directory_missing
    body = @erf.get_resource "images.XXX"
    assert_equal nil, body ,"try to get missing directory"
  end

end
